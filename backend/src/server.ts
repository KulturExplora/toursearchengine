import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import subscribersRoutes from "./routes/subscribers.routes";
import adminRoutes from "./routes/admin.routes";

import logger from "./utils/logger";

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof SyntaxError && "body" in error) {
        logger.error(
            "\x1b[31m[Server] Invalid JSON received:\x1b[0m",
            error.message
        );
        res.status(400).json({ error: "Invalid JSON format" });
        return;
    }
    next();
});

// Routes
app.get("/", (req, res) => {
    res.send("Hello, world!");
});
app.use("/api", adminRoutes);
app.use("/api", userRoutes);
app.use("/api", subscribersRoutes);

app.use((req, res) => {
    logger.error(` Route not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ error: "404 Not Found" });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
