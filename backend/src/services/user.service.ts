import { prisma } from "../db/prisma";
import { ServiceResponse } from "../types/types";
import { handlePrismaRequestError } from "../utils/errorHandler";
import logger from "../utils/logger";
import {
    checkRequiredFields,
    emailFormattingCheck,
} from "../utils/inputValidation";

//TODO: user.routes: add authentication then create login, updating user information, etc.

export const UserService = {
    async createUser(
        name: string,
        email: string
    ): Promise<ServiceResponse<{ id: string; name: string; email: string }>> {
        const requiredCheck = checkRequiredFields(
            { key: "name", value: name },
            { key: "email", value: email }
        );
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
            const user = await prisma.user.create({
                data: { name, email },
            });

            await logger.success(
                `[UserService] User created successfully:`,
                user
            );
            return { success: true, data: user };
        } catch (error) {
            return handlePrismaRequestError(error, "creating user");
        }
    },
};
