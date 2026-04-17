import { FastifyRequest, FastifyReply } from 'fastify'
import { ISnippetService } from '../../shared/contracts/ISnippetService.js'
import { createSnippetSchema } from './dtos/create-snippet.dto.js'
import { updateSnippetSchema } from './dtos/update-snippet.dto.js'

type SnippetParams = { Params: { id: string } }

export class SnippetController {
  constructor(private readonly snippetService: ISnippetService) {}

  async getFeatured(_request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const snippets = await this.snippetService.getFeatured()
    reply.send(snippets)
  }

  async getMySnippets(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const snippets = await this.snippetService.getMySnippets(request.user.sub)
    reply.send(snippets)
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
