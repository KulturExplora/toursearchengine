import { Request, Response, Router } from "express";
import { SubscribersService } from "../services/subscribers.service";
const router = Router();

// POST register
router.post("/subscribers", async (req: Request, res: Response) => {
    const { email } = req.body;
    const result = await SubscribersService.registerEmailForBeta(email);

    if (!result.success) {
        if (result.error === "Email already exists.") {
            // 409 Conflict for duplicates
            res.status(409);
            res.json({
                statusCode: res.statusCode,
                error: result.error,
            });
            return;
        }
        // 400 Bad Request for validation errors
        res.status(400).json({
            statusCode: res.statusCode,
            error: result.error,
        });
        return;
    }

    res.status(201).json({
        statusCode: res.statusCode,
        message: "Email registered successfully",
        data: result.data,
    });
});

export default router;
