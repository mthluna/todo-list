import { Request, Response } from 'express'

import Task from '../models/Task'
import { handleError } from '../utils'

export default  {
    async index (req: Request, res: Response) {
        const tasks = await Task.find({}).lean()
        res.json(tasks)
    },

    async get (req: Request, res: Response) {
        const {_id} = req.params;

        try {
            const task = await Task.findOne({_id}).lean();

            if (!task) return handleError(res, 'Task not found')

            res.status(200).json(task)
        }catch (e) {
            handleError(res, e.message)
        }
    },

    async store (req: Request, res: Response) {
        const { name, projectId, done = false } = req.body;

        const newTask = new Task({
            name, projectId, done
        })

        newTask.save((err, response) => {
            if (err) {
               return handleError(res, err.message)
            }

            res.status(200).json(response);
            res.end();
        })
    },

    async update (req: Request, res: Response) {
        const { name, done } = req.body;
        const { _id } = req.params;
        
        await Task.updateOne({_id}, {name, done}, (err, response) => {
            if (err) {
                return handleError(res, err.message)
            }

            res.status(200).json(response);
            res.end();
        });
    },

    async delete (req: Request, res: Response) {
        const { _id } = req.params;

        Task.deleteMany({ _id }, (err) => {
            if (err) {
               return handleError(res, err.message)
            }

            res.status(204);
            res.end();
        })
    }
}