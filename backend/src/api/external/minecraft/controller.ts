/**
 * @summary
 * Public API controller for Minecraft feature.
 *
 * @module api/external/minecraft/controller
 */

import { Request, Response, NextFunction } from 'express';
import { successResponse, isServiceError, errorResponse } from '@/utils';
import {
  tipList,
  tipGet,
  postList,
  postGet,
  postCreate,
  commentCreate,
} from '@/services/minecraft';
import { TIP_STATUS } from '@/constants';

export async function listTipsHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const category = req.query.category as string | undefined;
    const tips = await tipList(category);
    // Filter only published tips for public API
    const publishedTips = tips.filter((t) => t.status === TIP_STATUS.PUBLISHED);
    res.json(successResponse(publishedTips));
  } catch (error) {
    next(error);
  }
}

export async function getTipHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tip = await tipGet(req.params.id);
    if (tip.status !== TIP_STATUS.PUBLISHED) {
      res.status(404).json(errorResponse('Tip not found', 'NOT_FOUND'));
      return;
    }
    res.json(successResponse(tip));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

export async function listPostsHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const posts = await postList();
    res.json(successResponse(posts));
  } catch (error) {
    next(error);
  }
}

export async function getPostHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const post = await postGet(req.params.id);
    res.json(successResponse(post));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

export async function createPostHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const post = await postCreate(req.body);
    res.status(201).json(successResponse(post));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

export async function createCommentHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const comment = await commentCreate(req.params.id, req.body);
    res.status(201).json(successResponse(comment));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}
