import { FastifyRequest, FastifyReply } from 'fastify'
import { IAuthService } from '../../shared/contracts/IAuthService.js'
import { registerSchema } from './dtos/register.dto.js'
import { loginSchema } from './dtos/login.dto.js'

export class AuthController {
  constructor(private readonly authService: IAuthService) {}

  async register(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const parsed = registerSchema.safeParse(request.body)
    if (!parsed.success) {
      reply.status(400).send({ error: parsed.error.flatten().fieldErrors })
      return
    }

    const user = await this.authService.register(parsed.data)
    reply.status(201).send(user)
  }

  async login(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const parsed = loginSchema.safeParse(request.body)
    if (!parsed.success) {
      reply.status(400).send({ error: parsed.error.flatten().fieldErrors })
      return
    }

    const user = await this.authService.validateUser(parsed.data)
    const token = await reply.jwtSign({ sub: user.id })
    reply.send({ token })
  }
}
