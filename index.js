// index.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/connectDB');
const routes = require('./routes/index');
const setupSocket = require('./socket'); // ✅ correct import

dotenv.config();

const app = express();
const server = http.createServer(app);

connectDB();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'https://chat-app-pi-nine-97.vercel.app'],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api', routes);

// ✅ Attach socket.io to server
setupSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
