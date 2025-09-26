import Fastify from 'fastify';
import type { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import configPlugin from '@fastify/env';
import staticPlugin from '@fastify/static';
import { envSchema } from './config/env.schema';
import fs from 'node:fs/promises';
import { buildPlugins } from './plugins/index';
import { buildRepositories } from './repositories/index';
import { buildServices } from './services/index';
import { healthRoutes, surveySessionsRoutes } from './routes/index';

import { loggerOptions } from './utils/logger';
import registerHooks from './hooks/index';
import { constants } from './constants/index';

export default async function build(): Promise<FastifyInstance> {
  const app = Fastify({ logger: loggerOptions });

  try {
    await app.register(configPlugin, {
      schema: envSchema,
      dotenv: true,
    });

    await setupStaticIfAvailable(app);

    app.decorate('plugins', buildPlugins(app));
    app.decorate('repositories', buildRepositories(app));
    app.decorate('services', buildServices(app));

    // Register sensible plugin early so httpErrors and other utilities are available
    await app.register(async function sensibleWrapper(
      _fastify: FastifyInstance
    ) {
      await app.plugins.sensible.register();
    });

    await registerHooks(app);

    // Register all routes
    await app.register(healthRoutes, { prefix: constants.API_PREFIX });
    await app.register(surveySessionsRoutes, { prefix: constants.API_PREFIX });
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }

  return app;
}

async function setupStaticIfAvailable(app: FastifyInstance) {
  // Serve static files from the public directory (frontend build) only if it exists
  try {
    await fs.access('./public/index.html');
  } catch (err) {
    // No public folder, ignore.
    console.log('No public folder found, skipping static file serving:', err);
    return;
  }

  await app.register(staticPlugin, {
    root: process.cwd() + '/public',
    prefix: '/',
  });

  // SPA fallback: serve index.html for all non-API routes
  app.setNotFoundHandler(
    async (request: FastifyRequest, reply: FastifyReply) => {
      const apiPrefixPattern = new RegExp(
        `^${constants.API_PREFIX.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}`
      );

      // Only serve index.html for GET requests that don't start with the API prefix
      if (request.method === 'GET' && !request.url.match(apiPrefixPattern)) {
        return reply.sendFile('index.html');
      }

      // For API routes or other methods, return 404
      return reply.code(404).send({ error: 'Not Found' });
    }
  );
}
