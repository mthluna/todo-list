import { Router, Response, Request, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import UserController from './controllers/UserController'
import TasksController from './controllers/TasksController'
import ProjectController from './controllers/ProjectController'

const routes = Router();

const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    const token = authorization && authorization.replace(/^Bearer\s+/, "");

    if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, 'mysecret', function(err, decoded) {
      if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
      next();
    })
}

routes.post('/login', UserController.auth)
routes.post('/user', UserController.store)
routes.get('/users', verifyJWT, UserController.index)
routes.get('/user/:_id', verifyJWT, UserController.get)
routes.put('/user/:_id', verifyJWT, UserController.update)
routes.delete('/user/:_id', verifyJWT, UserController.delete)

routes.get('/tasks', verifyJWT, TasksController.index)
routes.get('/task/:_id', verifyJWT, TasksController.get)
routes.post('/task', verifyJWT, TasksController.store)
routes.put('/task/:_id', verifyJWT, TasksController.update)
routes.delete('/task/:_id', verifyJWT, TasksController.delete)

routes.post('/project', verifyJWT, ProjectController.store)
routes.get('/project/:_id', verifyJWT, ProjectController.get)
routes.get('/projects', verifyJWT, ProjectController.index)
routes.delete('/project/:_id', verifyJWT, ProjectController.delete)
routes.put('/project/:_id', verifyJWT, ProjectController.update)

export default routes;