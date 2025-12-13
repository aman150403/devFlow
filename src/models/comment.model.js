import { Schema, model } from "mongoose";

const commentSchema = new Schema(
    {
        content: {
            type: String,
            required: true
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        question: {
            type: Schema.Types.ObjectId,
            ref: 'Question',
            default: null
        },
        answer: {
            type: Schema.Types.ObjectId,
            ref: 'Answer',
            default: null
        },
        parent: {
            type: Schema.Types.ObjectId,
            ref: 'Comment',
            default: null
        },
        depth: {
            type: Number,
            default: 0
        },
        updatedAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
)

const Comment = model('Comment', commentSchema)

export { Comment }