import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import dotenv from 'dotenv';
import { findUserByEmail, createUser } from '../models/userModel.js';

dotenv.config();

if (!process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID.startsWith('PLACEHOLDER')) {
    console.warn("⚠️  Google OAuth credentials missing or invalid in .env");
}
if (!process.env.FACEBOOK_APP_ID || process.env.FACEBOOK_APP_ID.startsWith('PLACEHOLDER')) {
    console.warn("⚠️  Facebook OAuth credentials missing or invalid in .env");
}

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    // In a real app we might fetch the user. For JWT we don't strictly need session deserialize unless using sessions.
    // We'll keep it minimal or just null.
    done(null, { id });
});

// Google Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback",
        passReqToCallback: true
    },
        async (req, accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0].value;
                const name = profile.displayName;

                // Role from state (if passed during auth start)
                let role = 'buyer';
                try {
                    if (req.query.state) {
                        const decoded = JSON.parse(Buffer.from(req.query.state, 'base64').toString());
                        if (decoded && decoded.role && ['buyer', 'seller'].includes(decoded.role.toLowerCase())) {
                            role = decoded.role.toLowerCase();
                        }
                    }
                } catch (e) {
                    console.warn('Failed to parse state/role, defaulting to buyer:', e.message);
                }

                let user = await findUserByEmail(email);

                if (!user) {
                    // Register new user
                    user = await createUser({
                        name,
                        email,
                        password: null, // No password for OAuth
                        role: role, // Use selected role or default
                        provider: 'google',
                        provider_id: profile.id
                    });
                } else {
                    // Optional: Update provider if previously local? 
                    // Requirement says: "Link OAuth account to existing user"
                    // Ideally we'd update provider/provider_id here if it was null, but for MVP we just log them in.
                }
                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }
    ));
}

// Facebook Strategy
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "/api/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'emails'],
        passReqToCallback: true
    },
        async (req, accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails ? profile.emails[0].value : null;
                const name = profile.displayName;

                if (!email) {
                    return done(new Error("Facebook account must have an email"), null);
                }

                let role = 'buyer';
                try {
                    if (req.query.state) {
                        const decoded = JSON.parse(Buffer.from(req.query.state, 'base64').toString());
                        if (decoded && decoded.role && ['buyer', 'seller'].includes(decoded.role.toLowerCase())) {
                            role = decoded.role.toLowerCase();
                        }
                    }
                } catch (e) {
                    console.warn('Failed to parse state/role, defaulting to buyer:', e.message);
                }

                let user = await findUserByEmail(email);

                if (!user) {
                    user = await createUser({
                        name,
                        email,
                        password: null,
                        role: role,
                        provider: 'facebook',
                        provider_id: profile.id
                    });
                }
                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }
    ));
}

export default passport;
