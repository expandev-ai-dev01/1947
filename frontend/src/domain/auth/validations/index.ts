import { z } from 'zod';

export const loginSchema = z.object({
  admin_username: z.string('Usuário obrigatório').min(1, 'Usuário obrigatório'),
  admin_password: z.string('Senha obrigatória').min(1, 'Senha obrigatória'),
});

export type LoginFormInput = z.input<typeof loginSchema>;
export type LoginFormOutput = z.output<typeof loginSchema>;
