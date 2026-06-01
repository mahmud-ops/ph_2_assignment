import { pool } from "../../database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../../config";

const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  const { email, password } = payload;

  // fetching user with 'email'
  const userData = await pool.query(
    `
        SELECT * FROM users 
        WHERE email = $1
    `,
    [email],
  );

  const user = userData.rows[0];

  // check if the user exists
  if (!user) throw new Error("Invalid credentials !!");

  // if found, match the password from the payload with the password in the db
  const matchPassword = await bcrypt.compare(password, user.password);
  if (!matchPassword) throw new Error("Invalid credentials !!");

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  // get jwt
  const accessToken = jwt.sign(jwtPayload, config.accessKey as string, {
    expiresIn: "1d",
  });

  return { accessToken, user };
};

export const authService = {
  loginUserIntoDB,
};
