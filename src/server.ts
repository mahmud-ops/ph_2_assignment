import app from "./app.js";
import config from "./config/index.js";
import { initDB } from "./database/index.js";

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
