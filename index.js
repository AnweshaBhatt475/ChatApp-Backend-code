const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/connectDB');
const router = require('./routes/index');
const cookieParser = require('cookie-parser');
const http = require('http'); // Required to create HTTP server
const { setupSocket } = require('./socket/index'); // Exported setupSocket from socket/index.js

const app = express();

// ✅ CORS setup with allowed origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://chat-app-c2rh.vercel.app',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Health check route
app.get('/', (req, res) => {
  res.json({ message: `Server running at ${PORT}` });
});

// ✅ API routes
app.use('/api', router);

// ✅ Create HTTP server
const server = http.createServer(app);

// ✅ Attach Socket.IO logic
setupSocket(server);

// ✅ Start server after DB connection
const PORT = process.env.PORT || 4001;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});
