import { pool } from "../../database/index.js";
import bcrypt from "bcrypt";

const createUserInDB = async (payload: any) => {
  const { name, email, password, role } = payload;

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `
        INSERT INTO users (name, email, password, role)
        VALUES ($1, $2, $3, COALESCE($4,'contributor'))
        RETURNING id, name, email, role, created_at, updated_at
    `,
    [name, email, hashedPassword, role],
  );

  return result;
};

const getAllUsersFromDB = async () => {
  const result = await pool.query(
    `SELECT id, name, email, role, created_at, updated_at FROM users`,
  );
  return result;
};

const getSingleUserFromDB = async (id: any) => {
  const result = await pool.query(
    `
        SELECT * FROM users 
        WHERE id = $1
    `,
    [id],
  );
  return result;
};

const updateUserInDB = async (id: any, payload: any) => {
  const { name, email, password, role } = payload;

  let hashedPassword;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  const result = await pool.query(
    `
        UPDATE users
        SET 
          name = COALESCE($1, name),
          email = COALESCE($2, email),
          password = COALESCE($3, password),
          role = COALESCE($4, role),
          updated_at = NOW()
   
        WHERE id = $5
        RETURNING *
    `,
    [name, email, hashedPassword, role, id],
  );
  return result;
};

const deleteUserFromDB = async (id: any) => {
  const result = await pool.query(
    `
        DELETE FROM users
        WHERE id = $1
        RETURNING *
    `,
    [id],
  );
  return result;
};

export const userService = {
  createUserInDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateUserInDB,
  deleteUserFromDB,
};
