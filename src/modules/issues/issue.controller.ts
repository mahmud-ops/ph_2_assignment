import type { Request, Response } from "express";
import { issueService } from "./issue.service";

const createIssue = async (req: Request, res: Response) => {
  const reporter_id = req.user.id;

  const result = await issueService.createIssueInDB(req.body, reporter_id);

  res.status(201).json({
    success: true,
    message: "Issue created successfully",
    data: result.rows[0],
  });
};

export const issueController = {
  createIssue,
};
