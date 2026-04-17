import { Snippet } from '@prisma/client'

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
  findFeatured(): Promise<Snippet[]>
  findByOwner(ownerId: string): Promise<Snippet[]>
  findById(id: string): Promise<Snippet | null>
  create(data: CreateSnippetData): Promise<Snippet>
  update(id: string, data: UpdateSnippetData): Promise<Snippet>
  delete(id: string): Promise<void>
}
