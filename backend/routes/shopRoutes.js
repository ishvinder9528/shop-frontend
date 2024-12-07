import express from 'express';
import Shop from '../models/Shop.js';

const router = express.Router();

router.get('/shops', async (req, res) => {
    try {
        const shops = await Shop.find({})
            .select('name location gst phone about')
            .sort({ createdAt: -1 });
        res.status(200).json(shops);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching shops', error: error.message });
    }
});

export default router; 