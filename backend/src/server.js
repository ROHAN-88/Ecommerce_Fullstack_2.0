import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

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

// Init DB
createUsersTable();
createProductsTable();
createChatTables();

import chatRoutes from './routes/chatRoutes.js';
import productRoutes from './routes/productRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/products', productRoutes);
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
