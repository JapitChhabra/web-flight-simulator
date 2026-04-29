import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToMongo } from './db.js';
import authRoutes from './routes/auth.js';
import gameSessionsRoutes from './routes/gameSessions.js';

dotenv.config({ path: '.env.local' });

const app = express();

app.disable('x-powered-by');

if (!process.env.JWT_SECRET) {
	throw new Error('Missing required env var: JWT_SECRET');
}

app.use(
	cors({
		origin: process.env.CORS_ORIGIN || true,
		credentials: false
	})
);

app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
	return res.json({ ok: true });
});

app.use('/api/auth', authRoutes);
app.use('/api/game-sessions', gameSessionsRoutes);

// Generic error handler (fallback).
app.use((err, _req, res, _next) => {
	console.error(err);
	return res.status(500).json({ error: 'Internal server error' });
});

const port = Number(process.env.PORT || 3001);

async function start() {
	await connectToMongo();
	app.listen(port, () => {
		console.log(`API listening on port ${port}`);
	});
}

start().catch((err) => {
	console.error('Failed to start server:', err);
	process.exit(1);
});

