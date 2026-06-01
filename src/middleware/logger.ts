import type { NextFunction, Request, Response } from "express";
import fs from "fs";

const logger = (req: Request, res: Response, next: NextFunction) => {
  const log = `Url: ${req.url}, Method: ${req.method}, Time: ${Date.now()}`;

  fs.appendFile("log.txt", log, (error) => {
    if (error instanceof Error) console.log(error);
  });

  next();
};

export default logger