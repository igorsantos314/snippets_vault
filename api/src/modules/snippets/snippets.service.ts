import { Snippet } from '@prisma/client'
import {
  ISnippetService,
  CreateSnippetInput,
  UpdateSnippetInput,
} from '../../shared/contracts/ISnippetService.js'
import {
  ISnippetRepository,
  PaginationParams,
  PaginatedResult,
} from '../../shared/contracts/ISnippetRepository.js'
import { AppError } from '../../shared/errors/AppError.js'

export class SnippetService implements ISnippetService {
  constructor(private readonly snippetRepository: ISnippetRepository) {}

  async getFeatured(pagination: PaginationParams): Promise<PaginatedResult<Snippet>> {
    return this.snippetRepository.findFeatured(pagination)
  }

  async getMySnippets(userId: string, pagination: PaginationParams): Promise<PaginatedResult<Snippet>> {
    return this.snippetRepository.findByOwner(userId, pagination)
  }

  async create(data: CreateSnippetInput, userId: string): Promise<Snippet> {
    return this.snippetRepository.create({ ...data, ownerId: userId })
  }

  async update(id: string, userId: string, data: UpdateSnippetInput): Promise<Snippet> {
    const snippet = await this.snippetRepository.findById(id)

    if (!snippet) {
      throw new AppError('Snippet não encontrado.', 404)
    }

    // RN04: apenas o dono pode editar
    if (snippet.ownerId !== userId) {
      throw new AppError('Você não tem permissão para editar este snippet.', 403)
    }

    return this.snippetRepository.update(id, data)
  }

  async delete(id: string, userId: string): Promise<void> {
    const snippet = await this.snippetRepository.findById(id)

    if (!snippet) {
      throw new AppError('Snippet não encontrado.', 404)
    }

    // RN04: apenas o dono pode excluir
    if (snippet.ownerId !== userId) {
      throw new AppError('Você não tem permissão para excluir este snippet.', 403)
    }

    await this.snippetRepository.delete(id)
  }
}
