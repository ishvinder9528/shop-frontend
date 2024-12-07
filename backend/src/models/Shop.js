import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    location: { type: String, required: false, trim: true },
    gst: { type: String, required: false, unique: true, trim: true },
    phone: { type: String, required: false, trim: true },
    about: { type: String, required: false, trim: true }
}, {
    timestamps: true
});

const Shop = mongoose.model('Shop', shopSchema);

export default Shop;