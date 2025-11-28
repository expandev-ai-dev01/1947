import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { minecraftService, minecraftAdminService } from '../services';
import type { CreateTipDto, CreatePostDto, CreateCommentDto } from '../types';

// Public Hooks
export const useTips = (category?: string) => {
  return useQuery({
    queryKey: ['tips', category],
    queryFn: () => minecraftService.listTips(category),
  });
};

export const useTip = (id: string) => {
  return useQuery({
    queryKey: ['tip', id],
    queryFn: () => minecraftService.getTip(id),
    enabled: !!id,
  });
};

export const usePosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: () => minecraftService.listPosts(),
  });
};

export const usePost = (id: string) => {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => minecraftService.getPost(id),
    enabled: !!id,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePostDto) => minecraftService.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const useCreateComment = (postId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCommentDto) => minecraftService.createComment(postId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });
};

// Admin Hooks
export const useAdminTips = (category?: string) => {
  return useQuery({
    queryKey: ['admin-tips', category],
    queryFn: () => minecraftAdminService.listTips(category),
  });
};

export const useAdminTip = (id: string) => {
  return useQuery({
    queryKey: ['admin-tip', id],
    queryFn: () => minecraftAdminService.getTip(id),
    enabled: !!id,
  });
};

export const useCreateTip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTipDto) => minecraftAdminService.createTip(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tips'] });
      queryClient.invalidateQueries({ queryKey: ['tips'] });
    },
  });
};

export const useUpdateTip = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CreateTipDto>) => minecraftAdminService.updateTip(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tips'] });
      queryClient.invalidateQueries({ queryKey: ['admin-tip', id] });
      queryClient.invalidateQueries({ queryKey: ['tips'] });
      queryClient.invalidateQueries({ queryKey: ['tip', id] });
    },
  });
};

export const useDeleteTip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => minecraftAdminService.deleteTip(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tips'] });
      queryClient.invalidateQueries({ queryKey: ['tips'] });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => minecraftAdminService.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const useDeleteComment = (postId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => minecraftAdminService.deleteComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });
};
