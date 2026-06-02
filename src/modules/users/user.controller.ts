import type { Request, Response } from "express";
import { userService } from "./user.service";
import { sanitizeUser } from "./user.utility";

const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required.",
      });
    }

    const result = await userService.createUserInDB(req.body);

    return res.status(201).json({
      success: true,
      message: "User created successfully.",
      data: sanitizeUser(result.rows[0]),
    });
  } catch (error: any) {
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUsersFromDB();

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Users not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Fetched all users successfully.",
      data: result.rows.map(sanitizeUser),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const getSingleUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await userService.getSingleUserFromDB(id);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Fetched user successfully.",
      data: sanitizeUser(result.rows[0]),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    if (
      req.body.status !== "open" ||
      req.body.status !== "in_progree" ||
      req.body.status !== "resolved"
    ) {
      throw new Error("Invalid status");
    }

    const result = await userService.updateUserInDB(id, req.body);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Updated user successfully.",
      data: sanitizeUser(result.rows[0]),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await userService.deleteUserFromDB(id);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Deleted user successfully.",
      data: sanitizeUser(result.rows[0]),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

export const userController = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
