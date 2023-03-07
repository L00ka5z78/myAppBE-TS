import mongoose, {Model} from 'mongoose';
import {UserDocument} from "./User";


type TodoType = TodoDocument & mongoose.Document;

export interface TodoDocument extends mongoose.Document {
    user: UserDocument;
    title: string;
    description: string;
    completed: boolean;
    age: number;
}

const TodoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        completed: {
            type: Boolean,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {timestamps: true}
);

export const Todo: Model<TodoType> = mongoose.model<TodoType>('Todo', TodoSchema);
