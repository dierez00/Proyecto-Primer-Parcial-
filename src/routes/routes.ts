import express from 'express';
import { login, getTimeToken, updateToken } from '../controllers/auth.controller';
import { getAllUsers, saveUsers, updateUser, deleteUser } from '../controllers/usercrud';

const routes = express.Router();

routes.post('/login', login as express.RequestHandler);
routes.get('/getTimeToken', getTimeToken as express.RequestHandler);
routes.patch('/updateToken/:userId', updateToken as express.RequestHandler);
routes.get('/getUsers', getAllUsers);
routes.post('/users', saveUsers);
routes.put('/updateUser/:id', updateUser);
routes.delete('/deleteU/:id', deleteUser);

export default routes;