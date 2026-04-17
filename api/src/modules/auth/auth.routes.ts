import { FastifyInstance } from 'fastify'
import { AuthController } from './auth.controller.js'
import { AuthService } from './auth.service.js'
import { UserRepository } from './auth.repository.js'

export async function authRoutes(fastify: FastifyInstance): Promise<void> {
  const repository = new UserRepository()
  const service = new AuthService(repository)
  const controller = new AuthController(service)

  fastify.post('/register', (req, reply) => controller.register(req, reply))
  fastify.post('/login', (req, reply) => controller.login(req, reply))
}
