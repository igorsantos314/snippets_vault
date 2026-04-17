import { Snippet } from '@prisma/client'

export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginatedResult<T> {
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface CreateSnippetData {
  title: string
  description?: string
  language: string
  code: string
  ownerId: string
}

export interface UpdateSnippetData {
  title?: string
  description?: string
  language?: string
  code?: string
}

export interface ISnippetRepository {
  findFeatured(pagination: PaginationParams): Promise<PaginatedResult<Snippet>>
  findByOwner(ownerId: string, pagination: PaginationParams): Promise<PaginatedResult<Snippet>>
  findById(id: string): Promise<Snippet | null>
  create(data: CreateSnippetData): Promise<Snippet>
  update(id: string, data: UpdateSnippetData): Promise<Snippet>
  delete(id: string): Promise<void>
}
