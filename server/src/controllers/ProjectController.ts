import { Request, Response } from 'express'
import mongoose from 'mongoose'

import Project from '../models/Project'
import Task, { ITask } from '../models/Task'

import { handleError } from '../utils/index'

export default  {
    async index (req: Request, res: Response) {
        const projects = await Project.aggregate([
            {
                $lookup: {
                    from: 'tasks',
                    localField: '_id',
                    foreignField: 'projectId',
                    as: 'tasks'
                }
            }
        ])

        res.status(200).json(projects)
    },

    async get (req: Request, res: Response) {
        const { _id } = req.params;

        const ObjectId = mongoose.Types.ObjectId;

        try {
            const projects = await Project.aggregate([
                {
                    $match: {
                        _id: ObjectId(_id)
                    }
                },
                {
                    $lookup: {
                        from: 'tasks',
                        localField: '_id',
                        foreignField: 'projectId',
                        as: 'tasks'
                    }
                }
            ]);
    
            res.status(200).json(projects[0])
        } catch (e) {
            handleError(res, e.message)
        }
    },

    async store (req: Request, res: Response) {
        const { name, tasks, user_id } = req.body;

        const newProject = new Project({name, user_id})

        newProject.save(async (err, response) => {
            if (err) {
                return handleError(res, err.message)
            }

            try {
                const project = response;
                let insertedTasks: Array<ITask> = [];

                if (tasks) {
                    const tasksArr = tasks.map((task: Array<ITask>) => ({...task, projectId: project._id}))
                    const response = await Task.insertMany([...tasksArr])

                    insertedTasks = response;
                }

                res.status(200).json({...response.toJSON(), tasks: insertedTasks});
                res.end();
            } catch (e) {
                handleError(res, e.message)
            }
        })
    },

    async update (req: Request, res: Response) {
        const { name } = req.body;
        const { _id } = req.params;
        
        Project.updateOne({_id}, {name}, (err, response) => {
            if (err) {
                return handleError(res, err.message)
            }

            res.status(200).json(response);
            res.end();
        });
    },

    async delete (req: Request, res: Response) {
        const { _id } = req.params;
        const ObjectId = mongoose.Types.ObjectId;

        try {
            const [project] = await Project.aggregate([
                {
                    $match: {
                        _id: ObjectId(_id)
                    }
                },
                {
                    $lookup: {
                        from: 'tasks',
                        localField: '_id',
                        foreignField: 'projectId',
                        as: 'tasks'
                    }
                }
            ]);

            const tasks = project.tasks.map((task: ITask) => task._id)
            await Task.deleteMany({_id: {$in: tasks}})

            const response = await Project.deleteMany({_id})

            res.status(200).json(response);
        } catch (e) {
            handleError(res, e.message)
        }

    },
}