import { model, Schema } from "mongoose";

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        toLowerCase: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['User', 'Moderator', 'Admin'], 
        default: 'User'
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    }
})

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 15);
    next();
})

userSchema.methods.comparePassword = async function () {
    return await bcrypt.compare(userPassword, 15);
}

const User = model(userSchema, 'User')

export { User }