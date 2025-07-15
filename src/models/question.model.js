import { Schema, model } from 'mongoose'

const questionSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        body: {
            type: String,
            required: true
        },
        tags: [{type: String, trim: true}],
        upvotes: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
        }],
        downvotes: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
        }],
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {
        timestamps: true
    }
)

questionSchema.index({ title: 'text', body: 'text' })
questionSchema.index({ tags: 1 })
questionSchema.index({ createdAt: -1 })

const Question = model('Question', questionSchema)

export { Question }
