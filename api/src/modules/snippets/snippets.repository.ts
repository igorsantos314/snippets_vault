import { Snippet } from '@prisma/client'
import { prisma } from '../../database/prisma.js'
import {
  ISnippetRepository,
  CreateSnippetData,
  UpdateSnippetData,
} from '../../shared/contracts/ISnippetRepository.js'

export class SnippetRepository implements ISnippetRepository {
  async findFeatured(): Promise<Snippet[]> {
    return prisma.snippet.findMany({
      where: { featured: true },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findByOwner(ownerId: string): Promise<Snippet[]> {
    return prisma.snippet.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findById(id: string): Promise<Snippet | null> {
    return prisma.snippet.findUnique({ where: { id } })
  }

  async create(data: CreateSnippetData): Promise<Snippet> {
    return prisma.snippet.create({ data })
  }

  async update(id: string, data: UpdateSnippetData): Promise<Snippet> {
    return prisma.snippet.update({ where: { id }, data })
  }

  async delete(id: string): Promise<void> {
    await prisma.snippet.delete({ where: { id } })
  }
}
