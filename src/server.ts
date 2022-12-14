import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

// Import API routes
import v1Route from './routes/v1';

// Init
const app = express();
app.use(express.json());
app.use(cors());
app.set('trust proxy', true);
app.use(morgan(process.env.NODE_ENV !== 'production' ? 'dev' : 'common'));

// Routes
app.get('/', (req, res) => {
  return res.json({ message: 'Welcome to the MOCBOT API. Visit https://github.com/MasterOfCubesAU/mocbot-api' });
});

app.use('/v1', v1Route);

// Listen
const server = app.listen(parseInt(process.env.PORT), process.env.HOST, async () => {
  console.log(`⚡️ Server listening on port ${process.env.PORT} at ${process.env.HOST}`);
});

process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});
