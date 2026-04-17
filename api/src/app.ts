import Fastify, { FastifyInstance } from 'fastify'
import jwt from '@fastify/jwt'
import cors from '@fastify/cors'

import { env } from './config/env.js'
import { authRoutes } from './modules/auth/auth.routes.js'
import { snippetRoutes } from './modules/snippets/snippets.routes.js'
import { AppError } from './shared/errors/AppError.js'

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: env.NODE_ENV !== 'test',
  })

  // ── Plugins ─────────────────────────────────────────────────────────────────
  app.register(jwt, {
    secret: env.JWT_SECRET,
    sign: {
      expiresIn: env.JWT_EXPIRES_IN,
    },
  })

  app.register(cors, {
    origin: '*',
  })

  // ── Routes ──────────────────────────────────────────────────────────────────
  app.register(authRoutes, { prefix: '/auth' })
  app.register(snippetRoutes, { prefix: '/snippets' })

  // ── Global Error Handler ─────────────────────────────────────────────────────
  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof AppError) {
      reply.status(error.statusCode).send({ error: error.message })
      return
    }

    app.log.error(error)
    reply.status(500).send({ error: 'Erro interno do servidor.' })
  })

  return app
}
