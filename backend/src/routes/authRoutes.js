import express from 'express';
import passport from '../config/passport.js'; // Import configured passport
import jwt from 'jsonwebtoken';
import { register, login, registerSeller } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/register-seller', registerSeller);
router.post('/login', login);

// OAuth Helper to issue token
const matchAndToken = (req, res) => {
    const user = req.user;
    if (!user) return res.redirect('/login?error=auth_failed');

    const token = jwt.sign(
        { id: user.id, role: user.role, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    // Redirect to frontend with token
    // In production, consider secure cookie or a temporary code exchange.
    // For MVP, passing in URL hash or query param ok if immediately consumed and cleared.
    res.redirect(`http://localhost:3000/auth/callback?token=${token}&role=${user.role}&name=${encodeURIComponent(user.name)}`);
};

// Google Routes
router.get('/google', (req, res, next) => {
    const role = req.query.role || 'buyer';
    const state = Buffer.from(JSON.stringify({ role })).toString('base64');
    passport.authenticate('google', { scope: ['profile', 'email'], state })(req, res, next);
});

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    matchAndToken
);

// Facebook Routes
router.get('/facebook', (req, res, next) => {
    const role = req.query.role || 'buyer';
    const state = Buffer.from(JSON.stringify({ role })).toString('base64');
    passport.authenticate('facebook', { scope: ['email'], state })(req, res, next);
});

router.get('/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login', session: false }),
    matchAndToken
);

export default router;
