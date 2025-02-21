import { Request, Response, Router } from "express";
import { SubscribersService } from "../services/subscribers.service";
const router = Router();

// POST register
router.post("/subscribers", async (req: Request, res: Response) => {
    const { email } = req.body;
    const result = await SubscribersService.registerEmailForBeta(email);

    if (!result.success) {
        res.status(400).json({ error: result.error });
        return;
    }

    res.status(201).json({
        message: "Email registered successfully",
        data: result.data,
    });
});

export default router;
