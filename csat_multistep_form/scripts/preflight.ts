/*
  Preflight checks to block common generation failures:
  - Invalid/hidden unicode (NBSP, ZWSP, smart quotes, BOM, en/em dashes)
  - Template/token leftovers like __entity__
  - Disallowed ".js" import suffixes in TS/TSX source files
  - Escaped JSON-style quotes (\\") often from mis-emitted JSX
  - Presence of any *.template.ts files under src/

  Exits with non-zero code on any finding.
*/

import fs from "node:fs";
import path from "node:path";

type Finding = {
  file: string;
  line: number;
  column: number;
  message: string;
  snippet: string;
};

const SOURCE_DIRS = [
  path.resolve(process.cwd(), "backend", "src"),
  path.resolve(process.cwd(), "frontend", "src"),
];

const EXTENSIONS = new Set([".ts", ".tsx", ".sql"]);

// Hidden/invalid characters to forbid in codegen output
const INVALID_UNICODE_REGEX =
  /[\u00A0\u200B\u200C\u200D\uFEFF\u2013\u2014\u2018\u2019\u201C\u201D]/g; // NBSP, ZWSP, ZWNJ, ZWJ, BOM, en/em dashes, smart quotes

// Tokens/templates that must never ship
const TEMPLATE_TOKEN_REGEX = /__[^_\s]{1,32}__/g;

// Disallow .js import suffixes inside TS/TSX
const JS_IMPORT_REGEX =
  /(from\s+['"][^'"]+\.js['"])|(import\(\s*['"][^'"]+\.js['"]\s*\))/g;

// Suspicious JSON-escaped quotes that usually indicate escaped JSX
const ESCAPED_JSON_QUOTES_REGEX = /\\\"/g;

function walk(dir: string, files: string[] = []): string[] {
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, files);
    } else if (EXTENSIONS.has(path.extname(entry.name))) {
      files.push(full);
    }
  }
  return files;
}

function scanFile(file: string): Finding[] {
  const findings: Finding[] = [];
  let content: string;
  try {
    content = fs.readFileSync(file, "utf8");
  } catch {
    return findings;
  }

  const lines = content.split(/\r?\n/);

  const isTypescriptSource = file.endsWith(".ts") || file.endsWith(".tsx");
  const isTypeDefinitionFile = file.endsWith(".d.ts");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Invalid unicode
    for (const match of line.matchAll(INVALID_UNICODE_REGEX)) {
      findings.push({
        file,
        line: i + 1,
        column: (match.index || 0) + 1,
        message: "Invalid/hidden unicode character detected",
        snippet: line,
      });
    }

    // Template tokens
    for (const match of line.matchAll(TEMPLATE_TOKEN_REGEX)) {
      findings.push({
        file,
        line: i + 1,
        column: (match.index || 0) + 1,
        message: "Template token must be removed before build",
        snippet: line,
      });
    }

    // .js imports in TS/TSX
    if (isTypescriptSource) {
      for (const match of line.matchAll(JS_IMPORT_REGEX)) {
        findings.push({
          file,
          line: i + 1,
          column: (match.index || 0) + 1,
          message: "Disallowed .js import suffix in TypeScript source",
          snippet: line,
        });
      }

      // Escaped JSON-style quotes
      for (const match of line.matchAll(ESCAPED_JSON_QUOTES_REGEX)) {
        findings.push({
          file,
          line: i + 1,
          column: (match.index || 0) + 1,
          message: "Suspicious escaped quotes (possible JSON-escaped JSX)",
          snippet: line,
        });
      }

      // Disallow explicit or implicit any usages in TS/TSX (but allow in .d.ts)
      // Even though we've made any as a warning, this is intentionally left behind.
      // the use of any will not prevent the deployment of the app, and this preflight check
      // will attempt a fix for all any in the codebase.
      if (!isTypeDefinitionFile) {
        // Common any patterns: ": any", "as any", "<any>", "Array<any>", "Record<string, any>", generics like Promise<any>
        const ANY_PATTERNS = [
          /:\s*any\b/g,
          /\bas\s+any\b/g,
          /<\s*any\s*>/g,
          /Array<\s*any\s*>/g,
          /Promise<\s*any\s*>/g,
          /Record<\s*[^,>]+\s*,\s*any\s*>/g,
        ];
        for (const pattern of ANY_PATTERNS) {
          for (const match of line.matchAll(pattern)) {
            findings.push({
              file,
              line: i + 1,
              column: (match.index || 0) + 1,
              message: "Disallowed any type usage in TypeScript source",
              snippet: line,
            });
          }
        }
      }
    }
  }

  return findings;
}

function main() {
  const allFiles = SOURCE_DIRS.flatMap(dir => walk(dir));
  const allFindings: Finding[] = [];

  for (const file of allFiles) {
    // Block any *.template.ts still present under src
    if (/\.template\.ts$/.test(file)) {
      allFindings.push({
        file,
        line: 1,
        column: 1,
        message:
          "Template file (*.template.ts) must be removed/excluded before build",
        snippet: path.basename(file),
      });
      continue;
    }
    allFindings.push(...scanFile(file));
  }

  if (allFindings.length > 0) {
    // Group by file for readability
    const byFile = new Map<string, Finding[]>();
    for (const f of allFindings) {
      const arr = byFile.get(f.file) || [];
      arr.push(f);
      byFile.set(f.file, arr);
    }

    for (const [file, findings] of byFile) {
      console.error(`\n\x1b[31m${path.relative(process.cwd(), file)}\x1b[0m`);
      for (const f of findings) {
        console.error(
          `  ${f.line}:${f.column} — ${f.message}\n    ${f.snippet.trim()}`
        );
      }
    }

    console.error(`\nPreflight failed with ${allFindings.length} finding(s).`);
    process.exit(1);
  }

  // Ensure generated types exist
  const generatedTypesPath = path.resolve(
    process.cwd(),
    "openapi",
    "generated-types.d.ts"
  );
  if (!fs.existsSync(generatedTypesPath)) {
    console.error(
      `\nMissing generated API types: ${path.relative(process.cwd(), generatedTypesPath)}`
    );
    console.error("Run: cd openapi && pnpm generate-types");
    process.exit(1);
  }

  console.log("Preflight checks passed.");
}

main();
