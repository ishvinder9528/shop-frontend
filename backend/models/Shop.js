import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    gst: { type: String, required: true, unique: true, trim: true },
    phone: { type: String, required: true, trim: true },
    about: { type: String, required: true, trim: true }
}, {
    timestamps: true
});

export default mongoose.model('Shop', shopSchema); 