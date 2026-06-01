import type { NextFunction, Request, Response } from "express";

const auth = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log("This is a protected route")
  };
};

export default auth;
