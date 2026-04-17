import { User } from '@prisma/client'
import { prisma } from '../../database/prisma.js'
import { IUserRepository, CreateUserData } from '../../shared/contracts/IUserRepository.js'

export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } })
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } })
  }

  async create(data: CreateUserData): Promise<User> {
    return prisma.user.create({ data })
  }
}
