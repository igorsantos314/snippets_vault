import bcrypt from 'bcryptjs'
import {
  IAuthService,
  RegisterInputDto,
  LoginInputDto,
  UserResponseDto,
} from '../../shared/contracts/IAuthService.js'
import { IUserRepository } from '../../shared/contracts/IUserRepository.js'
import { AppError } from '../../shared/errors/AppError.js'

const SALT_ROUNDS = 12

export class AuthService implements IAuthService {
  constructor(private readonly userRepository: IUserRepository) {}

  async register(data: RegisterInputDto): Promise<UserResponseDto> {
    const existing = await this.userRepository.findByEmail(data.email)
    if (existing) {
      throw new AppError('E-mail já cadastrado.', 409)
    }

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS)

    const user = await this.userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    })

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    }
  }

  async validateUser(data: LoginInputDto): Promise<UserResponseDto> {
    const user = await this.userRepository.findByEmail(data.email)

    // Mensagem genérica intencional: não revelar se o e-mail existe (RN03)
    if (!user) {
      throw new AppError('Credenciais inválidas.', 401)
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password)
    if (!isPasswordValid) {
      throw new AppError('Credenciais inválidas.', 401)
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    }
  }
}
