import logger from "./logger";

// kiFunction to check any number of required fields dynamically
export const checkRequiredFields = (...args: { key: string; value: any }[]) => {
    const missingInputFields = args
        .filter(
            ({ value }) => value === undefined || value === null || value === ""
        )
        .map(({ key }) => key);

    if (missingInputFields.length > 0) {
        logger.error(
            `[USER INPUT] Validation failed: Missing required fields → ${missingInputFields.join(
                ", "
            )}`
        );
        return {
            success: false,
            error: `Missing required fields: ${missingInputFields.join(", ")}`,
        };
    }
    return { success: true };
};

export const emailFormattingCheck = (email: string) => {
    email = email.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email) || email.includes(" ")) {
        logger.error(
            `[USER INPUT] Validation failed: Invalid email format (${email})`
        );
        return { success: false, error: "Invalid email format." };
    }
    return { success: true };
};

export const checkIfValidUUID = (id: string): boolean => {
    const uuidRegex =
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return uuidRegex.test(id);
};
