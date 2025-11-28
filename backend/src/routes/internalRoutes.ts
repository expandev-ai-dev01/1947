/**
 * @summary
 * Internal API routes configuration.
 * Handles authenticated endpoints for business operations.
 *
 * @module routes/internalRoutes
 */

import { Router } from 'express';
import * as initExampleController from '@/api/internal/init-example/controller';
import * as minecraftAdminController from '@/api/internal/minecraft/controller';
import { authMiddleware } from '@/middleware/auth';

const router = Router();

// Init-Example routes
router.get('/init-example', initExampleController.listHandler);
router.post('/init-example', initExampleController.createHandler);
router.get('/init-example/:id', initExampleController.getHandler);
router.put('/init-example/:id', initExampleController.updateHandler);
router.delete('/init-example/:id', initExampleController.deleteHandler);

// Minecraft Admin Routes (Protected)
router.use(authMiddleware);

// Tips Management
router.get('/tips', minecraftAdminController.listTipsAdminHandler);
router.get('/tips/:id', minecraftAdminController.getTipAdminHandler);
router.post('/tips', minecraftAdminController.createTipHandler);
router.put('/tips/:id', minecraftAdminController.updateTipHandler);
router.delete('/tips/:id', minecraftAdminController.deleteTipHandler);

// Community Moderation
router.delete('/community/posts/:id', minecraftAdminController.deletePostHandler);
router.delete('/community/comments/:id', minecraftAdminController.deleteCommentHandler);

export default router;
