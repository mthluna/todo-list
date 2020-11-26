import mongoose from 'mongoose'

const Schema = mongoose.Schema

const taskSchema = new Schema({
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

export default mongoose.model('tasks', taskSchema)