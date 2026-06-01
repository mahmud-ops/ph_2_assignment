import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { userRouter } from "./modules/users/user.route";
import { authRouter } from "./modules/auth/auth.route";
import logger from "./middleware/logger";

const app: Application = express();

// middlewares
app.use(express.json());
app.use(logger);


app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Express app is running.",
    author: "Abdullah Al Mahmud",
  });
});

// routes
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);

export default app;
