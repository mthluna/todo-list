import mongoose, { Document, Schema } from 'mongoose'

export interface IUser extends Document {
    _id: string,
    name: string,
    email: string,
    password: string,
}

const userSchema: Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, {collection: 'users'})

export default mongoose.model<IUser>('users', userSchema)