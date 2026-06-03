import type { IUser } from "./user.interface.js";

export const sanitizeUser = (user: Partial<IUser>) => {
  const { password, ...rest } = user;
  return rest;
};
