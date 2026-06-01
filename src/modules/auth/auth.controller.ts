import type { Request, Response } from "express";
import { userService } from "../users/user.service";
import { sanitizeUser } from "../users/user.utiliry";
import { authService } from "./auth.service";

const signUpUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const result = await userService.createUserInDB(req.body);

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: sanitizeUser(result.rows[0]),
    });
  } catch (error: any) {
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const result = await authService.loginUserIntoDB(req.body);

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        token: result.accessToken,
        user: sanitizeUser(result.user),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

export const authController = {
  signUpUser,
  loginUser,
};
