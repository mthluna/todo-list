import { Router } from 'express';

import UserController from './controllers/UserController'
import TasksController from './controllers/TasksController'
import ProjectController from './controllers/ProjectController'

const routes = Router();

routes.get('/users', UserController.index)
routes.post('/user', UserController.store)
routes.get('/user/:_id', UserController.get)
routes.put('/user/:_id', UserController.update)
routes.delete('/user/:_id', UserController.delete)

routes.get('/tasks', TasksController.index)
routes.get('/task/:_id', TasksController.get)
routes.post('/task', TasksController.store)
routes.put('/task/:_id', TasksController.update)
routes.delete('/task/:_id', TasksController.delete)

routes.post('/project', ProjectController.store)
routes.get('/project/:_id', ProjectController.get)
routes.get('/projects', ProjectController.index)
routes.delete('/project/:_id', ProjectController.delete)
routes.put('/project/:_id', ProjectController.update)

export default routes;