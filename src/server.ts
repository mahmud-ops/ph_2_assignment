import app from "./app";
import { initDB } from "./database";

const port = 3000;

await initDB()
  .then(() =>
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    }),
  )
  .catch((error) => {
    console.log("Failed to initialize DB:", error);
    process.exit(1);
  });
