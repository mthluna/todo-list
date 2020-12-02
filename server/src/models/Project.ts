import mongoose, { Schema, Document } from 'mongoose'

export interface IProject extends Document {
    _id: string,
    name: string,
    user_id: string,
}

const projectSchema: Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }
}, {collection: 'projects'})

export default mongoose.model<IProject>('projects', projectSchema)