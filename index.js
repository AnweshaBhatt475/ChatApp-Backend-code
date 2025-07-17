const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/connectDB');
const router = require('./routes/index');
const cookieParser = require('cookie-parser');
const http = require('http');
const { setupSocket } = require('./socket/index');

const app = express();
const PORT = process.env.PORT || 4001; // ✅ Move this line up here

// ✅ CORS setup
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

app.use(express.json());
app.use(cookieParser());

// ✅ Health check route (now PORT is defined above)
app.get('/', (req, res) => {
  res.json({ message: `Server running at ${PORT}` });
});

app.use('/api', router);

const server = http.createServer(app);
setupSocket(server);

// ✅ Start server AFTER DB connection
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});
