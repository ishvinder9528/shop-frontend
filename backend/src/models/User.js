import mongoose from 'mongoose';

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
        required: true, 
        unique: true 
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

userSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        return ret;
    }
});

const User = mongoose.model('User', userSchema);
export default User; 