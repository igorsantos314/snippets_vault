import { z } from 'zod'

export const createSnippetSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório.'),
  description: z.string().optional(),
  language: z.string().min(1, 'Linguagem é obrigatória.'),
  code: z.string().min(1, 'Código é obrigatório.'),
})

export type CreateSnippetDto = z.infer<typeof createSnippetSchema>
