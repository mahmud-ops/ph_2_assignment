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

const getAllIssuesFromDB = async () => {
  const issueResult = await pool.query(
    `
    SELECT * FROM issues
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

export const issueService = {
  createIssueInDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
};
