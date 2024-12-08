import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import router from './routes.js';
import requestLogger from './middleware/requestLogger.js';
import logger from './config/logger.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_URL 
        : 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(requestLogger);

// Routes
app.use('/api', router);
app.get('/', (req, res) => {
    return res.status(200).json({
        message: 'Server is running'
    });
});

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});

// Error handling
process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Rejection:', err);
    process.exit(1);
}); 