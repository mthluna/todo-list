import { Request, Response } from 'express'

import User from '../models/User'
import { handleError } from '../utils'

export default  {
    async index (req: Request, res: Response) {
        const users = await User.find({}).lean()
        res.json(users)
    },

    async store (req: Request, res: Response) {
        const { name, email, password } = req.body;

        const newUser = new User({
            name,
            email,
            password
        })

        newUser.save((err) => {
            if (err) {
                res.status(500).json({
                    error: err.message
                })
                res.end()
                return
            }

            res.status(200).json(newUser);
            res.end();
        })
    },

    async update (req: Request, res: Response) {
        const { name, email, password } = req.body;
        const { _id } = req.params;
        
        User.updateOne({_id}, {name, email, password}, (err, response) => {
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