import express from "express";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import { ChatMessage, WSClientEvent, WSServerEvent, UserIdentity } from "./types";
import { generateIdentity } from "./identity";

const PORT = Number(process.env.PORT) || 4000;
const MAX_MESSAGES = 200;
const HISTORY_SIZE = 50;
const MAX_CONTENT_LENGTH = 500;

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// In-memory message buffer
const messages: ChatMessage[] = [];

// Track connected clients
const clients = new Map<WebSocket, UserIdentity>();

function broadcast(event: WSServerEvent) {
  const data = JSON.stringify(event);
  for (const ws of clients.keys()) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(data);
    }
  }
}

function getOnlineCount(): number {
  return clients.size;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

app.get("/health", (_req, res) => {
  res.json({ status: "ok", onlineCount: getOnlineCount() });
});

wss.on("connection", (ws) => {
  const identity = generateIdentity();
  clients.set(ws, identity);

  // Send init event with identity, recent messages, and online count
  const initEvent: WSServerEvent = {
    type: "init",
    user: identity,
    messages: messages.slice(-HISTORY_SIZE),
    onlineCount: getOnlineCount(),
  };
  ws.send(JSON.stringify(initEvent));

  // Broadcast updated online count to everyone
  broadcast({ type: "online_count", count: getOnlineCount() });

  ws.on("message", (raw) => {
    let event: WSClientEvent;
    try {
      event = JSON.parse(raw.toString());
    } catch {
      return;
    }

    if (event.type === "send_message") {
      const content = event.content?.trim();
      if (!content || content.length > MAX_CONTENT_LENGTH) return;

      const user = clients.get(ws);
      if (!user) return;

      const message: ChatMessage = {
        id: generateId(),
        avatar: user.avatar,
        name: user.name,
        badge: user.badge,
        content,
        timestamp: Date.now(),
      };

      messages.push(message);
      if (messages.length > MAX_MESSAGES) {
        messages.splice(0, messages.length - MAX_MESSAGES);
      }

      broadcast({ type: "new_message", message });
    }
  });

  ws.on("close", () => {
    clients.delete(ws);
    broadcast({ type: "online_count", count: getOnlineCount() });
  });
});

server.listen(PORT, () => {
  console.log(`daalledo-backend listening on port ${PORT}`);
});
