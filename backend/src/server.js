import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Passport
import passport from './config/passport.js';
app.use(passport.initialize());

// Basic Health Check
app.get('/api/health', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({
            status: 'ok',
            timestamp: result.rows[0].now,
            environment: process.env.NODE_ENV
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Database connection failed' });
    }
});

import authRoutes from './routes/authRoutes.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createUsersTable } from './models/userModel.js';
import { createProductsTable } from './models/productModel.js';
import { createChatTables } from './models/chatModel.js';
import { createAdsTable } from './models/adModel.js';
import { createSellerTables } from './models/sellerModel.js';
import { createWishlistTable } from './models/wishlistModel.js';

// Init DB
createUsersTable();
createProductsTable();
createChatTables();
createAdsTable();
createSellerTables();
createWishlistTable();

import chatRoutes from './routes/chatRoutes.js';
import productRoutes from './routes/productRoutes.js';
import adRoutes from './routes/adRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';

import swaggerUi from 'swagger-ui-express';
import specs from './config/swagger.js';

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/products', productRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/wishlist', wishlistRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

app.set('io', io); // Make io accessible in controllers

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on('join_chat', (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });

    socket.on('send_message', (data) => {
        socket.to(data.room).emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        console.log('User Disconnected', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
