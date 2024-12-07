import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        trim: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true 
    },
    picture: { 
        type: String, 
        required: false 
    },
    googleId: { 
        type: String, 
        unique: true, 
        sparse: true 
    },
    given_name: {
        type: String,
        required: false
    },
    family_name: {
        type: String,
        required: false
    },
    verified_email: {
        type: Boolean,
        default: false
    },
    lastLogin: { 
        type: Date, 
        default: Date.now 
    }
}, {
    timestamps: true,
    versionKey: false
});

userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
    return token;
};

userSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

const User = mongoose.model('User', userSchema);
export default User; 