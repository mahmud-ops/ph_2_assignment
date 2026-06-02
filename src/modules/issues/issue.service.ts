import { pool } from "../../database";

const createIssueInDB = async (payload: any, reporter_id: number) => {
  const { title, description, type } = payload;

  const result = await pool.query(
    `
      INSERT INTO issues (
        title,
        description,
        type,
        reporter_id
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
    [title, description, type, reporter_id],
  );

  return result;
};

const getAllIssuesFromDB = async (sort: string = "newest") => {
  if (sort !== "newest" && sort !== "oldest") {
    sort = "newest";
  }

  const orderDirection = sort === "oldest" ? "ASC" : "DESC";

  const issueResult = await pool.query(
    `
    SELECT * FROM issues
    ORDER BY created_at ${orderDirection}
    `,
  );

  const reporterIds = issueResult.rows.map((issue) => issue.reporter_id);

  const userResult = await pool.query(
    `
      SELECT id, name, role FROM users 
      WHERE id = ANY($1)
    `,
    [reporterIds],
  );

  const userLookup = new Map(userResult.rows.map((user) => [user.id, user]));

  const issues = issueResult.rows.map((issue) => ({
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter: userLookup.get(issue.reporter_id),
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  }));

  return issues;
};

const getSingleIssueFromDB = async (id: any) => {
  const issueResult = await pool.query(
    `
    SELECT * FROM issues
    WHERE id = $1
    `,
    [id],
  );

  const reporterIds = issueResult.rows.map((issue) => issue.reporter_id);

  const userResult = await pool.query(
    `
      SELECT id, name, role FROM users 
      WHERE id = ANY($1)
    `,
    [reporterIds],
  );

  const userLookup = new Map(userResult.rows.map((user) => [user.id, user]));

  const issues = issueResult.rows.map((issue) => ({
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter: userLookup.get(issue.reporter_id),
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  }));

  return issues;
};

const updateIssueInDB = async (
  id: any,
  payload: {
    title: string;
    description: string;
    type: string;
    status: string;
  },
  user: any,
) => {
  // get the issue via id
  const issueResult = await pool.query(
    `
    SELECT * FROM issues
    WHERE id = $1
    `,
    [id],
  );

  const issue = issueResult.rows[0];

  if (!issue) {
    throw new Error("Issue not found");
  }
  // check if maintainer
  const isMaintainer: boolean = user.role === "maintainer";

  // rules if not maintainer (contributor)
  if (!isMaintainer) {
    if (issue.reporter_id !== user.id) {
      throw new Error("Forbidden: not owner !!");
    }

    if (issue.status !== "open") {
      throw new Error("Forbidden: status locked !!");
    }
  }

  const { title, description, type, status } = payload;

  const result = await pool.query(
    `
      UPDATE issues
      SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        type = COALESCE($3, type),
        status = COALESCE($4, status),
        updated_at = NOW()
      WHERE id = $5
      RETURNING *
    `,
    [title, description, type, status, id],
  );

  return result;
};

const deleteIssueFromDB = async (id: any, user: any) => {
  // get the issue via id
  const issueResult = await pool.query(
    `
    SELECT * FROM issues
    WHERE id = $1
    `,
    [id],
  );

  const issue = issueResult.rows[0];

  if (!issue) {
    throw new Error("Issue not found");
  }
  // check if maintainer
  const isMaintainer: boolean = user.role === "maintainer";

  // rules if not maintainer (contributor)
  if (!isMaintainer) {
    throw new Error("Forbidden !!");
  }

  const result = await pool.query(
    `
      DELETE FROM issues
      WHERE id = $1
      RETURNING *
    `,
    [id],
  );

  return result;
};

export const issueService = {
  createIssueInDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
  updateIssueInDB,
  deleteIssueFromDB,
};
