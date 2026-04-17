function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] ?? defaultValue
  if (value === undefined || value === '') {
    throw new Error(`[Config] Variável de ambiente obrigatória ausente: ${key}`)
  }
  return value
}

export const env = {
  NODE_ENV: getEnv('NODE_ENV', 'development'),
  PORT: Number(getEnv('PORT', '3000')),
  HOST: getEnv('HOST', '0.0.0.0'),
  JWT_SECRET: getEnv('JWT_SECRET'),
  JWT_EXPIRES_IN: getEnv('JWT_EXPIRES_IN', '7d'),
  DATABASE_URL: getEnv('DATABASE_URL'),
} as const
