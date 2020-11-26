import { Response } from 'express'

export const handleError = (
    res: Response, message: String, status = 500
) => {
    res.status(status).json({
        error: message
    })
    res.end();
    return;
}