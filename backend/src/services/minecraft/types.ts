/**
 * @summary
 * Type definitions for Minecraft feature.
 *
 * @module services/minecraft/types
 */

import { TipCategory, TipStatus } from '@/constants';

// --- Tips ---

export interface TipEntity {
  id: string;
  title: string;
  category: TipCategory;
  content_body: string;
  status: TipStatus;
  author_id: string;
  created_at: string;
  updated_at: string;
}

export interface TipCreateRequest {
  title: string;
  category: TipCategory;
  content_body: string;
  status: TipStatus;
}

export interface TipUpdateRequest {
  title?: string;
  category?: TipCategory;
  content_body?: string;
  status?: TipStatus;
}

// --- Community ---

export interface PostEntity {
  id: string;
  nickname: string;
  title: string;
  body: string;
  created_at: string;
  comments_count?: number;
}

export interface CommentEntity {
  id: string;
  post_id: string;
  nickname: string;
  body: string;
  created_at: string;
}

export interface PostCreateRequest {
  nickname?: string;
  post_title: string;
  post_body: string;
  captcha_response: string;
}

export interface CommentCreateRequest {
  nickname?: string;
  comment_body: string;
  captcha_response: string;
}

export interface PostDetailEntity extends PostEntity {
  comments: CommentEntity[];
}
