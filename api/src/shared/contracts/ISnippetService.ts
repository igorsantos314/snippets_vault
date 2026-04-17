import { Snippet } from '@prisma/client'
import { PaginationParams, PaginatedResult } from './ISnippetRepository.js'

export interface CreateSnippetInput {
  title: string
  description?: string
  language: string
  code: string
}

export interface UpdateSnippetInput {
  title?: string
  description?: string
  language?: string
  code?: string
}

export interface ISnippetService {
  getFeatured(pagination: PaginationParams): Promise<PaginatedResult<Snippet>>
  getMySnippets(userId: string, pagination: PaginationParams): Promise<PaginatedResult<Snippet>>
  create(data: CreateSnippetInput, userId: string): Promise<Snippet>
  update(id: string, userId: string, data: UpdateSnippetInput): Promise<Snippet>
  delete(id: string, userId: string): Promise<void>
}
