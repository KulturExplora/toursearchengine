import { Prisma } from '@prisma/client';
import { logger } from '../utils/logger.js';

export const handlePrismaRequestError = (
  error: unknown,
  action: string,
  serviceName: string,
): { success: false; error: string } => {
  if (error instanceof Prisma.PrismaClientInitializationError) {
    logger.error(`Database connection failed during ${action}.`);
    return {
      success: false,
      error: 'Database connection error. Try again later.',
    };
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        logger.error(`[${serviceName}] Error: Unique constraint violated (${action})`);
        return { success: false, error: 'Email already exists.' };

      case 'P2025':
        logger.error(`[${serviceName}] Error: Record not found (${action}).`);
        return { success: false, error: 'Record not found.' };

      case 'P2003':
        logger.error(`[${serviceName}] Error: Foreign key constraint failed (${action}).`);
        return {
          success: false,
          error: 'Invalid reference to another record.',
        };

      case 'P2000':
        logger.error(`[${serviceName}] Error: Value too long for column (${action}).`);
        return { success: false, error: 'Input value is too long.' };

      case 'P2011':
        logger.error(`[${serviceName}] Error: Null constraint violation (${action}).`);
        return {
          success: false,
          error: 'Required fields cannot be null.',
        };

      case 'P1000':
      case 'P1001':
      case 'P1008':
        logger.error(`[${serviceName}] Error: Database connection issue (${action}).`);
        return {
          success: false,
          error: 'Database connection error. Try again later.',
        };

      default:
        logger.error(`[${serviceName}] Prisma error (${action}): `, error.message);
        return {
          success: false,
          error: `Database error occurred (${error.code})`,
        };
    }
  }

  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    logger.error(`[${serviceName}] Unknown Prisma request error during ${action}:`, error.message);
    return { success: false, error: 'Unknown database error. Please try again.' };
  }

  logger.error(`[${serviceName}] Unexpected error during (${action}):`, error);
  return { success: false, error: 'An unexpected error occurred.' };
};
