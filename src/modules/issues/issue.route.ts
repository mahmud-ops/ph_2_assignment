import { Router } from "express";
import { issueController } from "./issue.controller.js";
import auth from "../../middleware/auth.js";

const router = Router();

router.post("/", auth(), issueController.createIssue);
router.get("/", issueController.getAllIssues);
router.get("/:id", issueController.getSingleIssue);
router.patch("/:id",auth(),issueController.updateIssue);
router.delete("/:id",auth(),issueController.deleteIssue)

export const issueRouter = router;
