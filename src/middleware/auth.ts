import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config/index.js";
import { pool } from "../database/index.js";

const auth = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access!!",
      });
    }

    const decodedToken = jwt.verify(
      token as string,
      config.accessKey as string,
    ) as JwtPayload;

    // getting user from the db with the email from the token
    const userData = await pool.query(
      `
            SELECT * FROM users
            WHERE email = $1
        `,
      [decodedToken.email],
    );

    if (userData.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = userData.rows[0];

    next();
  };
};

export default auth;
