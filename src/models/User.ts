import { model, models, Schema } from "mongoose";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, 'username is required'],
        },
        email: {
            type: String,
            required: [true, 'email is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

export const User = models.User || model("User", userSchema)