import { z } from 'zod';

export const tipSchema = z.object({
  title: z
    .string('O campo título não pode ficar em branco.')
    .min(5, 'Mínimo de 5 caracteres')
    .max(100, 'Máximo de 100 caracteres'),
  category: z.enum(
    ['Sobrevivência', 'Construção', 'Redstone', 'Exploração'],
    'Selecione uma categoria.'
  ),
  content_body: z
    .string('O conteúdo deve ter no mínimo 50 caracteres.')
    .min(50, 'O conteúdo deve ter no mínimo 50 caracteres.'),
  status: z.enum(['Rascunho', 'Publicado']).default('Rascunho'),
});

export const postSchema = z.object({
  nickname: z
    .string()
    .max(30, 'Máximo de 30 caracteres')
    .regex(/^[a-zA-Z0-9_]*$/, 'Apenas letras, números e underscore')
    .optional(),
  post_title: z
    .string('O título do post não pode ficar em branco.')
    .min(5, 'Mínimo de 5 caracteres')
    .max(150, 'Máximo de 150 caracteres'),
  post_body: z
    .string('O conteúdo do post não pode ficar em branco.')
    .min(10, 'Mínimo de 10 caracteres')
    .max(2000, 'Máximo de 2000 caracteres'),
  captcha_response: z.string().min(1, 'Verificação de segurança falhou.'),
});

export const commentSchema = z.object({
  nickname: z
    .string()
    .max(30, 'Máximo de 30 caracteres')
    .regex(/^[a-zA-Z0-9_]*$/, 'Apenas letras, números e underscore')
    .optional(),
  comment_body: z
    .string('O comentário não pode ficar em branco.')
    .min(5, 'Mínimo de 5 caracteres')
    .max(1000, 'Máximo de 1000 caracteres'),
  captcha_response: z.string().min(1, 'Verificação de segurança falhou.'),
});

export type TipFormInput = z.input<typeof tipSchema>;
export type TipFormOutput = z.output<typeof tipSchema>;

export type PostFormInput = z.input<typeof postSchema>;
export type PostFormOutput = z.output<typeof postSchema>;

export type CommentFormInput = z.input<typeof commentSchema>;
export type CommentFormOutput = z.output<typeof commentSchema>;
