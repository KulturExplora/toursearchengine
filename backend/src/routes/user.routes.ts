import { Request, Response, Router } from "express";
import { UserService } from "../services/user.service";
const router = Router();

// POST Create User
router.post("/user", async (req: Request, res: Response) => {
    const { name, email } = req.body;
    const result = await UserService.createUser(name, email);

    if (!result.success) {
        res.status(400).json({ error: result.error });
        return;
    }

    res.status(201).json({
        message: "User created successfully",
        data: result.data,
    });
});

export default router;
