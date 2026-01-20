import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail } from '../models/userModel.js';

export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Validate role
        if (!['buyer', 'seller'].includes(role)) {
            // Allow creating 'admin' only manually or via seed if strictly needed, but for public register let's restrict or allow.
            // Prompt says "Role selection during registration", implies Buyer/Seller. Admin usually seeded.
            // Let's restrict public registration to buyer/seller.
            return res.status(400).json({ message: 'Invalid role' });
        }

        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await createUser({ name, email, password: hashedPassword, role });

        // Generate token immediately or ask to login? Let's just return success for Phase 1.
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create JWT
        const token = jwt.sign(
            { id: user.id, role: user.role, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
