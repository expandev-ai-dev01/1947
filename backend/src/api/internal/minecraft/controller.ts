/**
 * @summary
 * Admin API controller for Minecraft feature.
 *
 * @module api/internal/minecraft/controller
 */

import { Request, Response, NextFunction } from 'express';
import { successResponse, isServiceError, errorResponse } from '@/utils';
import {
  tipCreate,
  tipUpdate,
  tipDelete,
  postDelete,
  commentDelete,
  tipList,
  tipGet,
} from '@/services/minecraft';
import { AuthRequest } from '@/middleware/auth';

// --- Tips Management ---

export async function listTipsAdminHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Admin sees all tips
    const tips = await tipList(req.query.category as string);
    res.json(successResponse(tips));
  } catch (error) {
    next(error);
  }
}

export async function getTipAdminHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tip = await tipGet(req.params.id);
    res.json(successResponse(tip));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

export async function createTipHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authorId = (req as AuthRequest).user!.id;
    const tip = await tipCreate(req.body, authorId);
    res.status(201).json(successResponse(tip));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

export async function updateTipHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tip = await tipUpdate(req.params.id, req.body);
    res.json(successResponse(tip));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

export async function deleteTipHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await tipDelete(req.params.id);
    res.json(successResponse({ message: 'Tip deleted successfully' }));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

// --- Community Moderation ---

export async function deletePostHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await postDelete(req.params.id);
    res.json(successResponse({ message: 'Post deleted successfully' }));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

export async function deleteCommentHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await commentDelete(req.params.id);
    res.json(successResponse({ message: 'Comment deleted successfully' }));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}
