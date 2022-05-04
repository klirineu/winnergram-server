import express from "express";
import cors from "cors";
import morgan from "morgan";
import { Router } from "./routes";

const app = express();

app.use(cors("*"));
app.use(express.json({ limit: "50mb" }));
app.use(
    express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);
app.use("/wg", Router);
app.use(morgan("dev"));

export { app };
