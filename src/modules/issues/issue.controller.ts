import type { Request, Response } from "express";
import { issueService } from "./issue.service";

const createIssue = async (req: Request, res: Response) => {
  try {
    const reporter_id = req.user.id;

    const result = await issueService.createIssueInDB(req.body, reporter_id);

    res.status(201).json({
      success: true,
      message: "Issue created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    if (error.message === "Description must be at least 20 characters long") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const getAllIssues = async (req: Request, res: Response) => {
  try {
    const sort = req.query.sort as string | undefined;
    const type = req.query.type as string | undefined;
    const status = req.query.status as string | undefined;

    const result = await issueService.getAllIssuesFromDB(sort, type, status);

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Issues not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Issues retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const getSingleIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await issueService.getSingleIssueFromDB(id);

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Issues not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Issue retrieved successfully",
      data: result[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const updateIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const result = await issueService.updateIssueInDB(id, req.body, user);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Issue updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    if (error.message === "Description must be at least 20 characters long") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    if (error.message.includes("Forbidden")) {
      return res.status(403).json({
        success: false,
        message: error.message,
        error: error,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const deleteIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const result = await issueService.deleteIssueFromDB(id, user);

    res.status(200).json({
      success: true,
      message: "Issue deleted successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    if (error.message === "Issue not found") {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
        data: null,
      });
    }
    if (error.message.includes("Forbidden")) {
      return res.status(403).json({
        success: false,
        message: error.message,
        error: error,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

export const issueController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue,
};
