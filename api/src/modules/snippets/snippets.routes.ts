import { FastifyInstance } from 'fastify'
import { SnippetController } from './snippets.controller.js'
import { SnippetService } from './snippets.service.js'
import { SnippetRepository } from './snippets.repository.js'
import { authenticate } from '../../shared/middlewares/auth.middleware.js'

export async function snippetRoutes(fastify: FastifyInstance): Promise<void> {
  const repository = new SnippetRepository()
  const service = new SnippetService(repository)
  const controller = new SnippetController(service)

  // ── Rotas Públicas (RN02) ────────────────────────────────────────────────────
  fastify.get('/', (req, reply) => controller.getFeatured(req, reply))

  // ── Rotas Privadas — exigem JWT válido (RN03) ────────────────────────────────
  fastify.get(
    '/my',
    { preHandler: authenticate },
    (req, reply) => controller.getMySnippets(req, reply),
  )

  fastify.post(
    '/',
    { preHandler: authenticate },
    (req, reply) => controller.create(req, reply),
  )

  fastify.put<{ Params: { id: string } }>(
    '/:id',
    { preHandler: authenticate },
    (req, reply) => controller.update(req, reply),
  )

  fastify.delete<{ Params: { id: string } }>(
    '/:id',
    { preHandler: authenticate },
    (req, reply) => controller.delete(req, reply),
  )
}
