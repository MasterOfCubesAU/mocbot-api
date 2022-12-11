import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import * as dotenv from 'dotenv';

// Init
const CONFIG = dotenv.config().parsed;
const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan((process.env.NODE_ENV !== 'production') ? 'dev' : 'common'));

// Routes
app.get(CONFIG.BASE_URL, (req, res) => {
  return res.json({ message: 'Welcome to the MOCBOT API. Visit https://github.com/MasterOfCubesAU/mocbot-api' });
});

const server = app.listen(parseInt(CONFIG.PORT), CONFIG.HOST, () => {
  console.log(`⚡️ Server listening on port ${CONFIG.PORT} at ${CONFIG.HOST}`);
});

process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});
