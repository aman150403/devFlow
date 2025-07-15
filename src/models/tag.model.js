import { model, Schema } from "mongoose";

const tagSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        usageCount: {
            type: Number,
            default: 1
        }
    },
    {
        timestamps: true
    })

const Tag = model('Tag', tagSchema)

export { Tag }