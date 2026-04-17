import { FastifyRequest, FastifyReply } from 'fastify'
import { ISnippetService } from '../../shared/contracts/ISnippetService.js'
import { createSnippetSchema } from './dtos/create-snippet.dto.js'
import { updateSnippetSchema } from './dtos/update-snippet.dto.js'
import { paginationSchema } from './dtos/pagination.dto.js'

type SnippetParams = { Params: { id: string } }

export class SnippetController {
  constructor(private readonly snippetService: ISnippetService) {}

  async getFeatured(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const pagination = paginationSchema.parse(request.query)
    const result = await this.snippetService.getFeatured(pagination)
    reply.send(result)
  }

  async getMySnippets(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const pagination = paginationSchema.parse(request.query)
    const result = await this.snippetService.getMySnippets(request.user.sub, pagination)
    reply.send(result)
  }

  async create(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const parsed = createSnippetSchema.safeParse(request.body)
    if (!parsed.success) {
      reply.status(400).send({ error: parsed.error.flatten().fieldErrors })
      return
    }

    const snippet = await this.snippetService.create(parsed.data, request.user.sub)
    reply.status(201).send(snippet)
  }

  async update(
    request: FastifyRequest<SnippetParams>,
    reply: FastifyReply,
  ): Promise<void> {
    const parsed = updateSnippetSchema.safeParse(request.body)
    if (!parsed.success) {
      reply.status(400).send({ error: parsed.error.flatten().fieldErrors })
      return
    }

    const snippet = await this.snippetService.update(
      request.params.id,
      request.user.sub,
      parsed.data,
    )
    reply.send(snippet)
  }

  async delete(
    request: FastifyRequest<SnippetParams>,
    reply: FastifyReply,
  ): Promise<void> {
    await this.snippetService.delete(request.params.id, request.user.sub)
    reply.status(204).send()
  }
}
