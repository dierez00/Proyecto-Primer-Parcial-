import express from 'express';
import { login, getTimeToken, updateToken, getAllUsers, saveUsers, updateUser } from '../controllers/auth.controller';

const routes = express.Router();

routes.post('/login', login as express.RequestHandler);
routes.get('/getTimeToken', getTimeToken as express.RequestHandler);
routes.patch('/updateToken/:userId', updateToken as express.RequestHandler);
routes.get('/getUsers', getAllUsers);
routes.post('/users', saveUsers);
routes.put('/updateUser/:id', updateUser)

export default routes;