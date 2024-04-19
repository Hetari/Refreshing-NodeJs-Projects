import dotenv from "dotenv";
import helmet from "helmet";
import express from "express";

import { router as tasks } from "./routes/task.js";

// Load environment variables
dotenv.config();

// Port and host
const port = process.env.APP_PORT || 3000;
const host = process.env.APP_HOST || "localhost";

// creating the app
const app = express();

// middlewares
app.use(express.static("public"));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((err, req, res, next) => {
  if (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  } else next();
});

// routers
app.use("/api/v1/tasks", tasks);

// start the server
app.listen(port, host, () => {
  console.log(`Server started on ${host}:${port}`);
});
