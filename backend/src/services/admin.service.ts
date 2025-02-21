// admin.routes: This could include GET a Single User by ID, GET All Users, etc.
import { prisma } from "../db/prisma";
import { ServiceResponse } from "../types/types";
import { handlePrismaRequestError } from "../utils/errorHandler";
import logger from "../utils/logger";
import {
    checkRequiredFields,
    emailFormattingCheck,
    checkIfValidUUID,
} from "../utils/inputValidation";

export const AdminService = {
    async adminCreateUser(
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
                `[AdminService] User created successfully:`,
                user
            );
            return { success: true, data: user };
        } catch (error) {
            return handlePrismaRequestError(error, "creating user");
        }
    },

    async getUsers(): Promise<
        ServiceResponse<{ id: string; name: string; email: string }[]>
    > {
        try {
            const users = await prisma.user.findMany();
            logger.success("[AdminService] Fetched all users.");
            return { success: true, data: users };
        } catch (error) {
            return handlePrismaRequestError(error, "fetching users");
        }
    },

    async getUserById(
        userId: string
    ): Promise<ServiceResponse<{ id: string; name: string; email: string }>> {
        if (!userId) {
            logger.error(
                "[AdminService] Validation failed: User ID is required."
            );
            return { success: false, error: "User ID is required." };
        }

        if (!checkIfValidUUID(userId)) {
            logger.error(
                `[AdminService] Validation failed: Invalid user ID format (${userId})`
            );
            return { success: false, error: "Invalid user ID format." };
        }

        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
            });

            if (!user) {
                logger.error(
                    `[AdminService] User not found with ID: ${userId}`
                );
                return { success: false, error: "User not found." };
            }

            logger.success(
                `[AdminService] Retrieved user: ${user.name}, email: ${user.email}`
            );

            return { success: true, data: user };
        } catch (error) {
            return handlePrismaRequestError(error, "fetching user by ID");
        }
    },
};
