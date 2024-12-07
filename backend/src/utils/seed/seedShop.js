import mongoose from 'mongoose';
import { config } from 'dotenv';
import Shop from '../../models/Shop.js';
import connectDB from '../../config/db.js';

config();

const shops = [
    {
        "name": "GuruKirpa Collection",
        "location": "Noorpur",
        "gst": "AAN39830ONK0832",
        "phone": "983783474",
        "about": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum in dicta accusamus maiores dolore dignissimos consequuntur ad, ipsa reiciendis vero earum illo esse distinctio neque, culpa dolores repellat aspernatur eaque."
    }
];

const seedDB = async () => {
    try {
        await connectDB();
        await Shop.deleteMany({}); // Clear existing data
        await Shop.insertMany(shops);
        console.log('Database seeded successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();