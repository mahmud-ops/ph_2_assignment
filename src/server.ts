import app from "./app";
import { initDB } from "./database";

const port = 3000;

initDB();


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
