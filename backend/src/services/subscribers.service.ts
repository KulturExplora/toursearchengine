import { checkRequiredFields, emailFormattingCheck } from '../utils/inputValidation.js';
import { logger } from '../utils/logger.js';

import { ServiceResponse } from '../types/types.js';

import { PrismaProvider } from '../providers/prisma.provider.js';

export const SubscribersService = {
  async registerEmailForBeta(
    email: string,
  ): Promise<ServiceResponse<{ id: string; email: string }>> {
    const requiredCheck = checkRequiredFields({
      key: 'email',
      value: email,
    });
    if (!requiredCheck.success)
      return {
        success: false,
        error: requiredCheck.error || 'Missing required fields',
      };

    const emailCheck = emailFormattingCheck(email);
    if (!emailCheck.success) {
      return {
        success: false,
        error: emailCheck.error || 'Invalid email format.',
      };
    }

    const subscribeResult = await PrismaProvider.createSubscriber(email);

    if (subscribeResult.success) {
      logger.success(`[Subscribers Service] Email registered successfully:`, email);
    }

    return subscribeResult;
  },
};
