import mongoose from 'mongoose'

const Schema = mongoose.Schema

const projectSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        require: true
    }
}, {collection: 'projects'})

export default mongoose.model('projects', projectSchema)