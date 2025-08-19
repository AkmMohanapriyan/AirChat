// // server.js
// import express from 'express';
// import cors from 'cors';
// import cookieParser from 'cookie-parser';
// import dotenv from 'dotenv';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import connectDB from './config/db.js';
// import authRoutes from './routes/authRoutes.js';

// import userRoutes from './routes/userRoutes.js';
// import messageRoutes from './routes/messageRoutes.js';
// import notificationRoutes from './routes/notificationRoutes.js';

// import friendRoutes from './routes/friendRoutes.js';  // Add this import

// import chatRoutes from './routes/chatRoutes.js';


// import WebSocket, { WebSocketServer } from 'ws';
// import http from "http";



// // Load environment variables
// dotenv.config();

// // Create Express app
// const app = express();


// const server = http.createServer(app);

// // Calculate directory name (ES modules)
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Middleware
// app.use(cors({
//   origin: [process.env.FRONTEND_URL,'http://localhost:3000'],
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));
// app.use(express.json({ limit: '10kb' }));
// app.use(express.urlencoded({ extended: true, limit: '10kb' }));
// app.use(cookieParser());

// // Serve static files from uploads directory
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// // Connect to database
// connectDB();

// // Routes
// app.use('/api/auth', authRoutes);

// app.use('/api/users', userRoutes);
// app.use('/api/messages', messageRoutes);
// app.use('/api/notifications', notificationRoutes);

// app.use('/api', friendRoutes);

// app.use('/api/chats', chatRoutes);


// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ success: false, message: 'Something went wrong!' });
// });



// // Attach WebSocket to same server
// const wss = new WebSocketServer({ server });

// wss.on('connection', (ws) => {
//   ws.on('message', (message) => {
//     const data = JSON.parse(message.toString());

//     if (data.type === 'profileUpdate') {
//       wss.clients.forEach((client) => {
//         if (
//           client.readyState === WebSocket.OPEN &&
//           client.userId &&
//           data.friendIds.includes(client.userId)
//         ) {
//           client.send(
//             JSON.stringify({
//               type: 'profileUpdated',
//               userId: data.userId,
//               profilePhoto: data.profilePhoto,
//             })
//           );
//         }
//       });
//     }
//   });
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   console.log(`Serving static files from: ${path.join(__dirname, 'uploads')}`);
// });



import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import friendRoutes from "./routes/friendRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

import WebSocket, { WebSocketServer } from "ws";

dotenv.config();

const app = express();
const server = http.createServer(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Serve uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// DB connect
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api", friendRoutes);
app.use("/api/chats", chatRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Something went wrong!" });
});

// WebSocket
const wss = new WebSocketServer({ server });
wss.on("connection", (ws) => {
  console.log("WebSocket client connected");
  ws.on("message", (message) => {
    const data = JSON.parse(message.toString());
    if (data.type === "profileUpdate") {
      wss.clients.forEach((client) => {
        if (
          client.readyState === WebSocket.OPEN &&
          client.userId &&
          data.friendIds.includes(client.userId)
        ) {
          client.send(
            JSON.stringify({
              type: "profileUpdated",
              userId: data.userId,
              profilePhoto: data.profilePhoto,
            })
          );
        }
      });
    }
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📂 Serving uploads from ${path.join(__dirname, "uploads")}`);
});

