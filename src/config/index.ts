import dotenv from "dotenv";
import path from "node:path";

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

const config = {
  port: process.env.PORT,
  connectionString: process.env.CONNECTION_STRING,
  accessKey: process.env.ACCESS_SECRET,
};

export default config;