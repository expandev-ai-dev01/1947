/**
 * @summary
 * Business logic for Minecraft feature (Tips and Community).
 *
 * @module services/minecraft/service
 */

import { ServiceError } from '@/utils';
import { tipStore, postStore, commentStore } from '@/instances';
import { validateCaptcha } from '@/utils/captcha';
import { TIP_STATUS } from '@/constants';
import { TipEntity, PostEntity, PostDetailEntity, CommentEntity } from './types';
import {
  tipCreateSchema,
  tipUpdateSchema,
  postCreateSchema,
  commentCreateSchema,
  idSchema,
} from './validation';

// --- Tips Services ---

export async function tipList(category?: string): Promise<TipEntity[]> {
  let tips = tipStore.getAll();

  // Filter by category if provided
  if (category) {
    tips = tips.filter((t) => t.category === category);
  }

  // Public view only sees published tips
  // Note: Admin view might need all, but for now we return all and filter in controller if needed
  // or we can add a parameter 'includeDrafts'

  return tips as TipEntity[];
}

export async function tipGet(id: string): Promise<TipEntity> {
  const record = tipStore.getById(id);
  if (!record) {
    throw new ServiceError('NOT_FOUND', 'Tip not found', 404);
  }
  return record as TipEntity;
}

export async function tipCreate(body: unknown, authorId: string): Promise<TipEntity> {
  const validation = tipCreateSchema.safeParse(body);
  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Validation failed', 400, validation.error.errors);
  }

  const newTip = tipStore.add({
    ...validation.data,
    author_id: authorId,
  });

  return newTip as TipEntity;
}

export async function tipUpdate(id: string, body: unknown): Promise<TipEntity> {
  const idValidation = idSchema.safeParse({ id });
  if (!idValidation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Invalid ID', 400);
  }

  const validation = tipUpdateSchema.safeParse(body);
  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Validation failed', 400, validation.error.errors);
  }

  const updated = tipStore.update(id, validation.data);
  if (!updated) {
    throw new ServiceError('NOT_FOUND', 'Tip not found', 404);
  }

  return updated as TipEntity;
}

export async function tipDelete(id: string): Promise<void> {
  const deleted = tipStore.delete(id);
  if (!deleted) {
    throw new ServiceError('NOT_FOUND', 'Tip not found', 404);
  }
}

// --- Community Services ---

export async function postList(): Promise<PostEntity[]> {
  const posts = postStore.getAll();
  return posts.map((p) => ({
    ...p,
    comments_count: commentStore.getByPostId(p.id).length,
  }));
}

export async function postGet(id: string): Promise<PostDetailEntity> {
  const post = postStore.getById(id);
  if (!post) {
    throw new ServiceError('NOT_FOUND', 'Post not found', 404);
  }

  const comments = commentStore.getByPostId(id);
  return { ...post, comments } as PostDetailEntity;
}

export async function postCreate(body: unknown): Promise<PostEntity> {
  const validation = postCreateSchema.safeParse(body);
  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Validation failed', 400, validation.error.errors);
  }

  const { captcha_response, ...data } = validation.data;

  const isValidCaptcha = await validateCaptcha(captcha_response);
  if (!isValidCaptcha) {
    throw new ServiceError(
      'CAPTCHA_ERROR',
      'Verificação de segurança falhou. Tente novamente.',
      400
    );
  }

  const newPost = postStore.add({
    nickname: data.nickname || 'Anônimo',
    title: data.post_title,
    body: data.post_body,
  });

  return newPost as PostEntity;
}

export async function commentCreate(postId: string, body: unknown): Promise<CommentEntity> {
  const post = postStore.getById(postId);
  if (!post) {
    throw new ServiceError('NOT_FOUND', 'Post not found', 404);
  }

  const validation = commentCreateSchema.safeParse(body);
  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Validation failed', 400, validation.error.errors);
  }

  const { captcha_response, ...data } = validation.data;

  const isValidCaptcha = await validateCaptcha(captcha_response);
  if (!isValidCaptcha) {
    throw new ServiceError(
      'CAPTCHA_ERROR',
      'Verificação de segurança falhou. Tente novamente.',
      400
    );
  }

  const newComment = commentStore.add({
    post_id: postId,
    nickname: data.nickname || 'Anônimo',
    body: data.comment_body,
  });

  return newComment as CommentEntity;
}

export async function postDelete(id: string): Promise<void> {
  const deleted = postStore.delete(id);
  if (!deleted) {
    throw new ServiceError('NOT_FOUND', 'Post not found', 404);
  }
  // Cascade delete comments
  commentStore.deleteByPostId(id);
}

export async function commentDelete(id: string): Promise<void> {
  const deleted = commentStore.delete(id);
  if (!deleted) {
    throw new ServiceError('NOT_FOUND', 'Comment not found', 404);
  }
}
