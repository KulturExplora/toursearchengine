import { Request, Response, Router } from "express";
import { AdminService } from "../services/admin.service";
const router = Router();

// POST Create User
router.post("/user", async (req: Request, res: Response) => {
    const { name, email } = req.body;
    const result = await AdminService.adminCreateUser(name, email);

    if (!result.success) {
        res.status(400).json({ error: result.error });
        return;
    }

    res.status(201).json({
        message: "User created successfully",
        data: result.data,
    });
});

// GET a Single User by ID
router.get("/user/:id", async (req: Request, res: Response) => {
    const userId = req.params.id;
    const result = await AdminService.getUserById(userId);

    if (!result.success) {
        res.status(404).json({ error: result.error });
        return;
    }

    res.status(200).json({
        message: "User found",
        data: result.data,
    });
});

// GET All Users
router.get("/users", async (req: Request, res: Response) => {
    const result = await AdminService.getUsers();

    if (!result.success) {
        res.status(500).json({ error: result.error });
        return;
    }

    res.status(200).json({
        message: "Users fetched successfully",
        data: result.data,
    });
});

export default router;
