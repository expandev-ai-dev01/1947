/**
 * @summary
 * In-memory stores for Minecraft feature.
 *
 * @module instances/minecraft
 */

import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import { config } from '@/config';

// --- Types ---

export interface TipRecord {
  id: string;
  title: string;
  category: string;
  content_body: string;
  status: string;
  author_id: string;
  created_at: string;
  updated_at: string;
}

export interface PostRecord {
  id: string;
  nickname: string;
  title: string;
  body: string;
  created_at: string;
}

export interface CommentRecord {
  id: string;
  post_id: string;
  nickname: string;
  body: string;
  created_at: string;
}

export interface AdminRecord {
  id: string;
  username: string;
  password_hash: string;
}

// --- Stores ---

class TipStore {
  private records: Map<string, TipRecord> = new Map();

  add(record: Omit<TipRecord, 'id' | 'created_at' | 'updated_at'>): TipRecord {
    const now = new Date().toISOString();
    const id = randomUUID();
    const newRecord = { ...record, id, created_at: now, updated_at: now };
    this.records.set(id, newRecord);
    return newRecord;
  }

  update(id: string, data: Partial<TipRecord>): TipRecord | undefined {
    const existing = this.records.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...data, updated_at: new Date().toISOString() };
    this.records.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.records.delete(id);
  }

  getById(id: string): TipRecord | undefined {
    return this.records.get(id);
  }

  getAll(): TipRecord[] {
    return Array.from(this.records.values());
  }
}

class PostStore {
  private records: Map<string, PostRecord> = new Map();

  add(record: Omit<PostRecord, 'id' | 'created_at'>): PostRecord {
    const now = new Date().toISOString();
    const id = randomUUID();
    const newRecord = { ...record, id, created_at: now };
    this.records.set(id, newRecord);
    return newRecord;
  }

  delete(id: string): boolean {
    return this.records.delete(id);
  }

  getById(id: string): PostRecord | undefined {
    return this.records.get(id);
  }

  getAll(): PostRecord[] {
    return Array.from(this.records.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }
}

class CommentStore {
  private records: Map<string, CommentRecord> = new Map();

  add(record: Omit<CommentRecord, 'id' | 'created_at'>): CommentRecord {
    const now = new Date().toISOString();
    const id = randomUUID();
    const newRecord = { ...record, id, created_at: now };
    this.records.set(id, newRecord);
    return newRecord;
  }

  delete(id: string): boolean {
    return this.records.delete(id);
  }

  deleteByPostId(postId: string): void {
    for (const [id, record] of this.records.entries()) {
      if (record.post_id === postId) {
        this.records.delete(id);
      }
    }
  }

  getByPostId(postId: string): CommentRecord[] {
    return Array.from(this.records.values())
      .filter((c) => c.post_id === postId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
}

class AdminStore {
  private records: Map<string, AdminRecord> = new Map();

  constructor() {
    // Seed default admin
    const salt = bcrypt.genSaltSync(config.security.bcryptRounds);
    const hash = bcrypt.hashSync('admin123', salt);
    const id = randomUUID();
    this.records.set(id, {
      id,
      username: 'admin',
      password_hash: hash,
    });
  }

  findByUsername(username: string): AdminRecord | undefined {
    return Array.from(this.records.values()).find((a) => a.username === username);
  }

  getById(id: string): AdminRecord | undefined {
    return this.records.get(id);
  }
}

export const tipStore = new TipStore();
export const postStore = new PostStore();
export const commentStore = new CommentStore();
export const adminStore = new AdminStore();
