import mongoose, { Schema, Document } from 'mongoose'

export interface ITask extends Document {
    _id: string,
    name: string,
    done: boolean,
    projectId: string
}

const taskSchema: Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    done: {
        type: Boolean,
        default: false
    },
    projectId: {
        type: Schema.Types.ObjectId,
        ref: 'projects',
        required: true
    }
}, {collection: 'tasks'})

export default mongoose.model<ITask>('tasks', taskSchema)