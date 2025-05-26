import express from 'express';
import morgan from 'morgan';
import routes from './routes/routes';
import connectDB from './config/bd';

const app = express();
const PORT  = process.env.PORT || 4000;

app.use(express.json());
app.use(morgan('dev'));
app.use('/', routes);

connectDB().then(() => {
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
  });
