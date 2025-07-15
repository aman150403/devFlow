const { Schema, model } = require("mongoose");

const answerSchema = new Schema(
    {
        content: {
            type: String,
            required: true
        },
        question: {
            type: Schema.Types.ObjectId,
            ref: 'Question',
            required: true
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        upvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        downvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }]
    },
    {
        timestamps: true
    }
)

const Answer = model('Answer', answerSchema);

export { Answer };