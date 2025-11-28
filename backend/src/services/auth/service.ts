/**
 * @summary
 * Authentication service.
 *
 * @module services/auth/service
 */

import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '@/config';
import { adminStore } from '@/instances';
import { ServiceError } from '@/utils';
import { z } from 'zod';

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export async function login(body: unknown): Promise<{ token: string }> {
  const validation = loginSchema.safeParse(body);
  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Invalid credentials format', 400);
  }

  const { username, password } = validation.data;
  const admin = adminStore.findByUsername(username);

  if (!admin) {
    throw new ServiceError('AUTH_ERROR', 'Nome de usuário ou senha incorretos.', 401);
  }

  const isMatch = await bcrypt.compare(password, admin.password_hash);
  if (!isMatch) {
    throw new ServiceError('AUTH_ERROR', 'Nome de usuário ou senha incorretos.', 401);
  }

  const token = jwt.sign(
    { id: admin.id, username: admin.username, role: 'admin' },
    config.security.jwtSecret,
    { expiresIn: config.security.jwtExpiresIn } as SignOptions
  );

  return { token };
}
