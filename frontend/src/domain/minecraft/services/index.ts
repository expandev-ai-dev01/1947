import { publicClient, authenticatedClient } from '@/core/lib/api';
import type { Tip, Post, Comment, CreateTipDto, CreatePostDto, CreateCommentDto } from '../types';

// Public Services
export const minecraftService = {
  async listTips(category?: string): Promise<Tip[]> {
    const params = category ? { category } : {};
    const { data } = await publicClient.get('/tips', { params });
    return data.data;
  },

  async getTip(id: string): Promise<Tip> {
    const { data } = await publicClient.get(`/tips/${id}`);
    return data.data;
  },

  async listPosts(): Promise<Post[]> {
    const { data } = await publicClient.get('/community/posts');
    return data.data;
  },

  async getPost(id: string): Promise<Post> {
    const { data } = await publicClient.get(`/community/posts/${id}`);
    return data.data;
  },

  async createPost(post: CreatePostDto): Promise<Post> {
    const { data } = await publicClient.post('/community/posts', post);
    return data.data;
  },

  async createComment(postId: string, comment: CreateCommentDto): Promise<Comment> {
    const { data } = await publicClient.post(`/community/posts/${postId}/comments`, comment);
    return data.data;
  },
};

// Admin Services
export const minecraftAdminService = {
  async listTips(category?: string): Promise<Tip[]> {
    const params = category ? { category } : {};
    const { data } = await authenticatedClient.get('/tips', { params });
    return data.data;
  },

  async getTip(id: string): Promise<Tip> {
    const { data } = await authenticatedClient.get(`/tips/${id}`);
    return data.data;
  },

  async createTip(tip: CreateTipDto): Promise<Tip> {
    const { data } = await authenticatedClient.post('/tips', tip);
    return data.data;
  },

  async updateTip(id: string, tip: Partial<CreateTipDto>): Promise<Tip> {
    const { data } = await authenticatedClient.put(`/tips/${id}`, tip);
    return data.data;
  },

  async deleteTip(id: string): Promise<void> {
    await authenticatedClient.delete(`/tips/${id}`);
  },

  async deletePost(id: string): Promise<void> {
    await authenticatedClient.delete(`/community/posts/${id}`);
  },

  async deleteComment(id: string): Promise<void> {
    await authenticatedClient.delete(`/community/comments/${id}`);
  },
};
