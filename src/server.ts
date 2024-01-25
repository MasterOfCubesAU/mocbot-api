import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import asyncHandler from 'express-async-handler';
import { validateSession } from '@src/auth';
import { SwaggerTheme } from 'swagger-themes';
import { morganMiddleware } from '@utils/MorganMiddleware';
import Logger from '@utils/Logger';
import { Request, Response, NextFunction } from 'express';
import chalk from 'chalk';

// Import API routes
import v1Route from '@routes/v1';

// Init
const app = express();
app.use(express.json());
app.use(cors());
app.use('/public', express.static('public'));
app.set('trust proxy', true);
app.set('json replacer', (_: any, value: any) => (typeof value === 'bigint' ? value.toString() + 'n' : value));
app.use(morganMiddleware);
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
app.get('/healthcheck', (req, res) => {
  res.send('OK!');
})

// All routes below this are authenticated
app.use(
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await validateSession(req.headers['x-api-key'] as string);
    next();
  })
);

// Protected Routes

app.use('/v1', v1Route);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.status || err.statusCode || 500;
  if (statusCode === 500) {
    Logger.error(chalk.hex('#FF0000').bold(err));
  }
  res.status(statusCode).json({
    error: {
      message: err.message,
    },
  });
  return next();
});

// Listen
const server = app.listen(parseInt(process.env.PORT), process.env.HOST, async () => {
  Logger.debug(`⚡️ Server listening on port ${process.env.PORT} at ${process.env.HOST}`);
});

process.on('SIGINT', () => {
  server.close(() => Logger.debug('Shutting down server gracefully.'));
});
