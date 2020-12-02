import { Request, Response } from 'express'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

import Project from '../models/Project'
import User from '../models/User'

import { handleError } from '../utils'

export default  {
    async index (req: Request, res: Response) {
        const users = await User.find({}).lean()
        res.json(users)
    },

    async get (req: Request, res: Response) {
        const { _id } = req.params;

        try {
            const user = await User.findOne({_id}).lean();

            const ObjectId = mongoose.Types.ObjectId;
            const projects = await Project.aggregate([
                {
                    $match: {
                        user_id: ObjectId(_id)
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

            const obj = {...user, projects}
    
            res.status(200).json(obj);
        } catch (e) {
            handleError(res, e.message)
        }
    },

    async store (req: Request, res: Response) {
        const { name, email, password } = req.body;

        const hash = await bcrypt.hash(password, 10)

        const newUser = new User({
            name,
            email,
            password: hash
        })

        newUser.save((err) => {
            if (err) {
                return handleError(res, err.message)
            }

            res.status(200).json(newUser);
            res.end();
        })
    },

    async update (req: Request, res: Response) {
        const { name, email, password } = req.body;
        const { _id } = req.params;
        
        const hash = await bcrypt.hash(password, 10)

        User.updateOne({_id}, {name, email, password: hash}, (err, response) => {
            if (err) {
                return handleError(res, err.message)
            }

            res.status(200).json(response);
            res.end();
        });
    },

    async delete (req: Request, res: Response) {
        const { _id } = req.params;

        User.deleteMany({ _id }, (err) => {
            if (err) {
                return handleError(res, err.message);
            }

            res.status(204);
            res.end();
        })
    }
}