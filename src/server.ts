import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import * as dotenv from 'dotenv';

// Init
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.set('trust proxy', true);
app.use(morgan((process.env.NODE_ENV !== 'production') ? 'dev' : 'common'));

// Routes
app.get(process.env.BASE_URL, (req, res) => {
  return res.json({ message: 'Welcome to the MOCBOT API. Visit https://github.com/MasterOfCubesAU/mocbot-api' });
});

const server = app.listen(parseInt(process.env.PORT), process.env.HOST, () => {
  console.log(`⚡️ Server listening on port ${process.env.PORT} at ${process.env.HOST}`);
});

process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});
