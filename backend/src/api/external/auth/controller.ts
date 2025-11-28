/**
 * @summary
 * Public Auth controller.
 *
 * @module api/external/auth/controller
 */

import { Request, Response, NextFunction } from 'express';
import { successResponse, isServiceError, errorResponse } from '@/utils';
import { login } from '@/services/auth/service';

export async function loginHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await login(req.body);
    res.json(successResponse(result));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}
