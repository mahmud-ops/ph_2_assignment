import app from "./app";
import config from "./config";
import { initDB } from "./database";

const port = config.port;

// connect DB first , then start app

initDB()
  .then(() =>
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    }),
  )
  .catch((error) => {
    console.log("Failed to initialize DB:", error);
    process.exit(1);
  });
