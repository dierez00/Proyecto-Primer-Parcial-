import express from 'express';
import morgan from 'morgan';
import routes from './routes/routes';
import connectDB from './config/bd';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

// Configura CORS solo para el frontend en Railway
app.use('/app', cors({
  origin: 'https://front-production-09a4.up.railway.app',
  credentials: true // por si usas cookies o headers de autorización
}), routes);

app.use(express.json());
app.use(morgan('dev'));

connectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
