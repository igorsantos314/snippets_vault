import { z } from 'zod'

export const updateSnippetSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  language: z.string().min(1).optional(),
  code: z.string().min(1).optional(),
})

export type UpdateSnippetDto = z.infer<typeof updateSnippetSchema>
