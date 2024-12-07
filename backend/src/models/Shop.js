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

const Shop = mongoose.model('Shop', shopSchema);

export default Shop;