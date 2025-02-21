import { prisma } from "../db/prisma";
import { ServiceResponse } from "../types/types";
import { handlePrismaRequestError } from "../utils/errorHandler";
import {
    checkRequiredFields,
    emailFormattingCheck,
} from "../utils/inputValidation";
import logger from "../utils/logger";

export const SubscribersService = {
    async registerEmailForBeta(
        email: string
    ): Promise<ServiceResponse<{ id: string; email: string }>> {
        const requiredCheck = checkRequiredFields({
            key: "email",
            value: email,
        });
        if (!requiredCheck.success)
            return {
                success: false,
                error: requiredCheck.error || "Missing required fields",
            };

        const emailCheck = emailFormattingCheck(email);
        if (!emailCheck.success) {
            return {
                success: false,
                error: emailCheck.error || "Invalid email format.",
            };
        }

        try {
            const newEmail = await prisma.betaSubscribers.create({
                data: { email },
            });

            await logger.success(
                `[Subscribers Service] Email registered successfully:`,
                email
            );
            return { success: true, data: newEmail };
        } catch (error) {
            return handlePrismaRequestError(error, "registering email");
        }
    },
};
