import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

function normalizeUsername(username) {
	return String(username || '').trim().toLowerCase();
}

function signToken(user) {
	return jwt.sign(
		{ username: user.username },
		process.env.JWT_SECRET,
		{ subject: user._id.toString(), expiresIn: '7d' }
	);
}

router.post('/signup', async (req, res) => {
	try {
		const username = normalizeUsername(req.body?.username);
		const password = String(req.body?.password || '');

		if (!username || username.length < 3) {
			return res.status(400).json({ error: 'Username must be at least 3 characters' });
		}
		if (!password || password.length < 6) {
			return res.status(400).json({ error: 'Password must be at least 6 characters' });
		}

		const existing = await User.findOne({ username });
		if (existing) {
			return res.status(409).json({ error: 'Username already exists' });
		}

		const passwordHash = await bcrypt.hash(password, 12);

		const user = await User.create({
			username,
			passwordHash
		});

		const token = signToken(user);
		return res.json({ token });
	} catch (err) {
		return res.status(500).json({ error: 'Signup failed' });
	}
});

router.post('/login', async (req, res) => {
	try {
		const username = normalizeUsername(req.body?.username);
		const password = String(req.body?.password || '');

		const user = await User.findOne({ username });
		if (!user) {
			return res.status(401).json({ error: 'Invalid credentials' });
		}

		const ok = await bcrypt.compare(password, user.passwordHash);
		if (!ok) {
			return res.status(401).json({ error: 'Invalid credentials' });
		}

		const token = signToken(user);
		return res.json({ token });
	} catch {
		return res.status(500).json({ error: 'Login failed' });
	}
});

router.get('/me', requireAuth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('username');
		if (!user) return res.status(404).json({ error: 'User not found' });
		return res.json({ user: { id: user._id.toString(), username: user.username } });
	} catch {
		return res.status(500).json({ error: 'Failed to load user' });
	}
});

export default router;

