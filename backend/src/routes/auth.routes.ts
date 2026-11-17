import { Router } from "express";
import { signup, getAllUsers, refreshToken, logout, login } from "../controllers/auth.controller";
import { authenticateToken } from "../middleware/authenticateToken";

const authRouter = Router();

authRouter.post("/signup", signup);
authRouter.get("/users", authenticateToken, getAllUsers);
authRouter.post("/login", login);
authRouter.post("/refresh-token", refreshToken);
authRouter.post("/logout", logout);

export default authRouter;
