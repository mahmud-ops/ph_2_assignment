import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { userRouter } from "./modules/users/user.route";
import { authRouter } from "./modules/auth/auth.route";

const app: Application = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Express app is running.",
    author: "Abdullah Al Mahmud",
  });
});

app.use("/api/users", userRouter);
app.use("/api/auth",authRouter);

export default app;
