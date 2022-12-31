import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import asyncHandler from 'express-async-handler';
import { validateSession } from '@src/auth';
import { Request, Response, NextFunction } from 'express';
import { SwaggerTheme } from 'swagger-themes';

// Import API routes
import v1Route from '@routes/v1';

// Init
const app = express();
app.use(express.json());
app.use(cors());
app.use('/public', express.static('public'));
app.set('trust proxy', true);
app.set('json replacer', (_: any, value: any) => (typeof value === 'bigint' ? value.toString() + 'n' : value));
app.use(morgan(process.env.NODE_ENV !== 'production' ? 'dev' : 'common'));
const theme = new SwaggerTheme('v3');

const swaggerOptions = {
  customCss: theme.getBuffer('dark'),
  customSiteTitle: 'MOCBOT API',
  customfavIcon: '/public/favicon.ico',
};

// Public Routes
app.get('/', (req: Request, res: Response) => {
  res.redirect('/docs');
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(YAML.load('docs/api.yml'), swaggerOptions));

// All routes below this are authenticated
app.use(
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await validateSession(req.headers['x-api-key'] as string);
    next();
  })
);

// Protected Routes

app.use('/v1', v1Route);

// Listen
const server = app.listen(parseInt(process.env.PORT), process.env.HOST, async () => {
  console.log(`⚡️ Server listening on port ${process.env.PORT} at ${process.env.HOST}`);
});

process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});
