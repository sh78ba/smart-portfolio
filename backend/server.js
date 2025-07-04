import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/api.js';

dotenv.config();

const app = express();

// ✅ CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'https://smart-portfolio-frontend.vercel.app',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
