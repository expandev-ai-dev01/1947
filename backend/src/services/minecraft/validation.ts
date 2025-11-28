/**
 * @summary
 * Validation schemas for Minecraft feature.
 *
 * @module services/minecraft/validation
 */

import { z } from 'zod';
import { TIP_CATEGORIES, TIP_STATUS, MINECRAFT_LIMITS } from '@/constants';

// --- Tips ---

export const tipCreateSchema = z.object({
  title: z.string().min(MINECRAFT_LIMITS.TIP_TITLE_MIN).max(MINECRAFT_LIMITS.TIP_TITLE_MAX),
  category: z.enum([
    TIP_CATEGORIES.SURVIVAL,
    TIP_CATEGORIES.BUILDING,
    TIP_CATEGORIES.REDSTONE,
    TIP_CATEGORIES.EXPLORATION,
  ]),
  content_body: z.string().min(MINECRAFT_LIMITS.TIP_BODY_MIN),
  status: z.enum([TIP_STATUS.DRAFT, TIP_STATUS.PUBLISHED]),
});

export const tipUpdateSchema = tipCreateSchema.partial();

// --- Community ---

const nicknameSchema = z
  .string()
  .max(MINECRAFT_LIMITS.POST_NICKNAME_MAX)
  .regex(/^[a-zA-Z0-9_]*$/, 'Nickname must be alphanumeric or underscore')
  .optional()
  .or(z.literal(''));

export const postCreateSchema = z.object({
  nickname: nicknameSchema,
  post_title: z.string().min(MINECRAFT_LIMITS.POST_TITLE_MIN).max(MINECRAFT_LIMITS.POST_TITLE_MAX),
  post_body: z.string().min(MINECRAFT_LIMITS.POST_BODY_MIN).max(MINECRAFT_LIMITS.POST_BODY_MAX),
  captcha_response: z.string().min(1),
});

export const commentCreateSchema = z.object({
  nickname: nicknameSchema,
  comment_body: z
    .string()
    .min(MINECRAFT_LIMITS.COMMENT_BODY_MIN)
    .max(MINECRAFT_LIMITS.COMMENT_BODY_MAX),
  captcha_response: z.string().min(1),
});

export const idSchema = z.object({
  id: z.string().uuid(),
});
