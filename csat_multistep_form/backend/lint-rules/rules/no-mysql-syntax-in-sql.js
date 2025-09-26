import regex from 'eslint-plugin-regex';
import anyParser from 'any-eslint-parser';

export default {
  files: ['**/*.sql'],
  languageOptions: {
    parser: anyParser,
  },
  plugins: {
    regex,
  },
  rules: {
    'regex/invalid': [
      'error',
      [
        // INDEX
        {
          id: 'mysql-inline-index',
          regex: 'INDEX\\s+\\w+\\s*\\([^)]*\\)',
          flags: 'i',
          message:
            'Inline INDEX definitions inside CREATE TABLE are MySQL-only. Use a separate CREATE INDEX statement in Postgres.',
        },

        //  UUIDs - catch malformed UUIDs that have the right pattern but wrong characters
        {
          id: 'invalid-uuid-format',
          regex:
            "'[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}'",
          message:
            'UUID literals should be lowercase hex, version 1-5, and variant 8/9/a/b.',
        },
      ],
    ],
  },
};
