const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/connectDB');
const router = require('./routes/index');
const cookieParser = require('cookie-parser');

const app = express();




// ✅ Flexible CORS setup
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
];


const allowedOrigins = [
  'https://chat-app-c2rh.vercel.app', 
  'http://localhost:5173'             
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

// ✅ WebSocket setup
const { app: socketApp, server } = require('./socket/index');
socketApp.use(app);

// ✅ Port
const PORT = process.env.PORT || 4001;

// ✅ Health check route
app.get('/', (req, res) => {
  res.json({ message: `Server running at ${PORT}` });
});

// ✅ API routes
app.use('/api', router);







// ✅ DB connection + start server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});
