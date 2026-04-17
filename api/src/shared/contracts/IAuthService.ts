export interface RegisterInputDto {
  name: string
  email: string
  password: string
}

export interface LoginInputDto {
  email: string
  password: string
}

export interface UserResponseDto {
  id: string
  name: string
  email: string
  createdAt: Date
}

export interface IAuthService {
  register(data: RegisterInputDto): Promise<UserResponseDto>
  validateUser(data: LoginInputDto): Promise<UserResponseDto>
}
