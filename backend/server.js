import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import jobRouter from "./app/routers/jobRouter.js";
import { watchJobStatus } from "./app/services/jobService.js";

config();

const app = express();
const PORT = process.env.PORT || 5000;

const server = createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("Client connected via WebSocket");
  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

const broadcastJobUpdate = (jobId) => {
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify({ jobId }));
    }
  });
};

watchJobStatus(broadcastJobUpdate);

app.use(cors());
app.use(express.json());

app.use("/jobs", jobRouter);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
