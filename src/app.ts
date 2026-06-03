import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { userRouter } from "./modules/users/user.route.js";
import { authRouter } from "./modules/auth/auth.route.js";
import logger from "./middleware/logger.js";
import { issueRouter } from "./modules/issues/issue.route.js";
import globalErrorHandler from "./middleware/globalErrorHandler.js";

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
app.use("/api/issues", issueRouter);

app.use(globalErrorHandler);

export default app;
