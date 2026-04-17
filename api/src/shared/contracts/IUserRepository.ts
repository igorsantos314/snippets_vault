import { User } from '@prisma/client'

export interface CreateUserData {
  name: string
  email: string
  password: string
}

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
  create(data: CreateUserData): Promise<User>
}
