import { Snippet } from '@prisma/client'
import { prisma } from '../../database/prisma.js'
import {
  ISnippetRepository,
  CreateSnippetData,
  UpdateSnippetData,
  PaginationParams,
  PaginatedResult,
} from '../../shared/contracts/ISnippetRepository.js'

export class SnippetRepository implements ISnippetRepository {
  async findFeatured({ page, limit }: PaginationParams): Promise<PaginatedResult<Snippet>> {
    const skip = (page - 1) * limit
    const [data, total] = await prisma.$transaction([
      prisma.snippet.findMany({
        where: { featured: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.snippet.count({ where: { featured: true } }),
    ])
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } }
  }

  async findByOwner(ownerId: string, { page, limit }: PaginationParams): Promise<PaginatedResult<Snippet>> {
    const skip = (page - 1) * limit
    const [data, total] = await prisma.$transaction([
      prisma.snippet.findMany({
        where: { ownerId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.snippet.count({ where: { ownerId } }),
    ])
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } }
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
