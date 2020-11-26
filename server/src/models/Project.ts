import mongoose from 'mongoose'

const Schema = mongoose.Schema

const projectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
}, {collection: 'projects'})

export default mongoose.model('projects', projectSchema)