import express from 'express';
import morgan from 'morgan';
import routes from './routes/routes';

const app = express();
const PORT  = process.env.PORT || 4000;

app.use(express.json());
app.use(morgan('dev'));
app.use('/', routes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
