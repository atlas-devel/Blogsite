import type { Express } from "express";
import express from "express";
import "dotenv/config";
import authRoute from "./routes/auth.routes";

const app: Express = express();

// middleware
app.use(express.json());
// routes

app.use("/api", authRoute);

const port = Number(process.env.PORT) || 4000;

app.listen(port, () =>
  console.log("Server has already started on port " + port),
);
