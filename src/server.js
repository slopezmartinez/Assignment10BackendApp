import express from 'express';
import morgan from 'morgan';
import postRoutes from './routes/postRoutes.js';
import authRoutes from './routes/authRoutes.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import swaggerUi from 'swagger-ui-express';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const openapiDoc = yaml.load(
  fs.readFileSync(path.join(__dirname, 'openapi.yaml'), 'utf8')
);
const PORT = process.env.PORT || 3000;

app.use(express.json());
if (process.env.NODE_ENV !== 'test') app.use(morgan('tiny'));


app.use('/api/posts', postRoutes);
app.use('/api/auth', authRoutes);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  if (!err.status) {
    err.status = 500;
    err.message = 'Internal Server Error';
  }
  res.status(err.status).json({ error: err.message });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}

export default app;
