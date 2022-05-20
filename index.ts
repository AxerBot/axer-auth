import express from "express";
import path from "path";
import dotenv from "dotenv";
dotenv.config();
import getVerification from "./helpers/getVerification";
import { consoleCheck } from "./logger";
import validateUser from "./helpers/validateUser";
import "./discordClient";
const server = express();

server.use(
  "/static",
  express.static(path.resolve(__dirname.concat("/static")))
);

server.get("/authorize/", (req, res) =>
  res
    .status(200)
    .sendFile(path.resolve(__dirname.concat("/pages/SaveCredentials.html")))
);

server.get("/getVerification/:user/:code", getVerification);

server.get("/validate", (req, res) =>
  res
    .status(200)
    .sendFile(path.resolve(__dirname.concat("/pages/ValidateCredentials.html")))
);

server.post("/validateUser/:user/:guild", validateUser);

server.listen(process.env.PORT || 3000, () => {
  consoleCheck("server", "Server running!");
});
