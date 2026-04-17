import 'dotenv/config'
import { buildApp } from './src/app.js'
import { env } from './src/config/env.js'

const app = await buildApp()

try {
  await app.listen({ port: env.PORT, host: env.HOST })
} catch (err) {
  app.log.error(err)
  process.exit(1)
}
