/**
 * @summary
 * Simple in-memory rate limiting middleware.
 *
 * @module middleware/rateLimit
 */

import { Request, Response, NextFunction } from 'express';

// Store: IP -> Array of timestamps
const requestLog = new Map<string, number[]>();

// Configuration: 5 requests per minute per IP
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 5;

export function rateLimitMiddleware(req: Request, res: Response, next: NextFunction): void {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();

  const timestamps = requestLog.get(ip) || [];

  // Filter out old timestamps
  const recentTimestamps = timestamps.filter((time) => now - time < WINDOW_MS);

  if (recentTimestamps.length >= MAX_REQUESTS) {
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Você está postando muito rápido. Por favor, aguarde um momento.',
      },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  recentTimestamps.push(now);
  requestLog.set(ip, recentTimestamps);

  next();
}
