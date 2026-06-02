import type { IIssue } from "./issue.interface";

type SortOption = "newest" | "oldest";

const sortIssue = (issues: IIssue[], sort: SortOption = "newest"): IIssue[] => {
  return issues.sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return sort === "newest" ? dateB - dateA : dateA - dateB;
  });
};

export { sortIssue };
