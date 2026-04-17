import { Snippet } from '@prisma/client'

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
  getFeatured(): Promise<Snippet[]>
  getMySnippets(userId: string): Promise<Snippet[]>
  create(data: CreateSnippetInput, userId: string): Promise<Snippet>
  update(id: string, userId: string, data: UpdateSnippetInput): Promise<Snippet>
  delete(id: string, userId: string): Promise<void>
}
