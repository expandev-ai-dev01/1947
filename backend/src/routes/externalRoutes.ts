/**
 * @summary
 * External API routes configuration.
 * Handles public endpoints that don't require authentication.
 *
 * @module routes/externalRoutes
 */

import { Router } from 'express';
import * as minecraftController from '@/api/external/minecraft/controller';
import * as authController from '@/api/external/auth/controller';
import { rateLimitMiddleware } from '@/middleware/rateLimit/rateLimitMiddleware';

const router = Router();

// Auth
router.post('/auth/login', authController.loginHandler);

// Tips (Public Read)
router.get('/tips', minecraftController.listTipsHandler);
router.get('/tips/:id', minecraftController.getTipHandler);

// Community (Public Read & Create)
router.get('/community/posts', minecraftController.listPostsHandler);
router.get('/community/posts/:id', minecraftController.getPostHandler);

// Apply rate limit for creation
router.post('/community/posts', rateLimitMiddleware, minecraftController.createPostHandler);
router.post(
  '/community/posts/:id/comments',
  rateLimitMiddleware,
  minecraftController.createCommentHandler
);

export default router;
