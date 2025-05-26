import express from 'express';
import { login, getTimeToken, updateToken } from '../controllers/auth.controller';

const routes = express.Router();

routes.post('/login', login as express.RequestHandler);
routes.get('/getTimeToken', getTimeToken as express.RequestHandler);
routes.patch('/updateToken/:userId', updateToken as express.RequestHandler);

export default routes;