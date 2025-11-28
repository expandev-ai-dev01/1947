/**
 * @summary
 * Constants for Minecraft feature.
 *
 * @module constants/minecraft
 */

export const TIP_CATEGORIES = {
  SURVIVAL: 'Sobrevivência',
  BUILDING: 'Construção',
  REDSTONE: 'Redstone',
  EXPLORATION: 'Exploração',
} as const;

export const TIP_STATUS = {
  DRAFT: 'Rascunho',
  PUBLISHED: 'Publicado',
} as const;

export const MINECRAFT_LIMITS = {
  TIP_TITLE_MIN: 5,
  TIP_TITLE_MAX: 100,
  TIP_BODY_MIN: 50,
  POST_NICKNAME_MAX: 30,
  POST_TITLE_MIN: 5,
  POST_TITLE_MAX: 150,
  POST_BODY_MIN: 10,
  POST_BODY_MAX: 2000,
  COMMENT_BODY_MIN: 5,
  COMMENT_BODY_MAX: 1000,
} as const;

export type TipCategory = (typeof TIP_CATEGORIES)[keyof typeof TIP_CATEGORIES];
export type TipStatus = (typeof TIP_STATUS)[keyof typeof TIP_STATUS];
