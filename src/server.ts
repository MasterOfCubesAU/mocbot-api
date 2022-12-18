import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

// Import API routes
import v1_route from '@routes/v1';

// Init
const app = express();
app.use(express.json());
app.use(cors());
app.set('trust proxy', true);
app.use(morgan(process.env.NODE_ENV !== 'production' ? 'dev' : 'common'));

// Routes
app.get('/', (req, res) => {
  res.redirect('/docs');
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(YAML.load('docs/api.yml')));
app.use('/v1', v1_route);

// Listen
const server = app.listen(parseInt(process.env.PORT), process.env.HOST, async () => {
  console.log(`⚡️ Server listening on port ${process.env.PORT} at ${process.env.HOST}`);
});

process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});
