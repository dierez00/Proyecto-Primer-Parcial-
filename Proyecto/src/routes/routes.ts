import express from 'express';
import { login, getTimeToken } from '../controllers/auth.controller';

const routes = express.Router();

routes.post('/login', login as express.RequestHandler);
routes.post('/getTimeToken', getTimeToken as express.RequestHandler);

export default routes;