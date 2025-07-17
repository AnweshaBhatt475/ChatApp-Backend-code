const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/connectDB');
const router = require('./routes/index');
const cookieParser = require('cookie-parser');
const http = require('http'); // ✅ Add HTTP server module
const { setupSocket } = require('./socket/index'); // ✅ Updated export from socket/index.js

const app = express();

// ✅ Merged CORS origins (removed duplicate)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://chat-app-c2rh.vercel.app'
];

// ✅ Use CORS with dynamic origin check
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

app.use(express.json());
app.use(cookieParser());

// ✅ Port
const PORT = process.env.PORT || 4001;

// ✅ Health check route
app.get('/', (req, res) => {
  res.json({ message: `Server running at ${PORT}` });
});

// ✅ API routes
app.use('/api', router);

// ✅ Create HTTP server and attach Socket.IO
const server = http.createServer(app);
setupSocket(server); // ✅ Pass server to socket/index.js

// ✅ DB connection + start server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});
