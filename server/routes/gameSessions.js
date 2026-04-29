import express from 'express';
import { GameSession } from '../models/GameSession.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

function validateNumber(value) {
	const n = Number(value);
	return Number.isFinite(n) ? n : null;
}

router.post('/start', requireAuth, async (req, res) => {
	try {
		const spawn = req.body?.spawn;
		if (!spawn) return res.status(400).json({ error: 'Missing spawn data' });

		const startTimeMs = req.body?.startTimeMs;
		const startTime = new Date(Number(startTimeMs));
		if (!Number.isFinite(startTimeMs) || Number.isNaN(startTime.getTime())) {
			return res.status(400).json({ error: 'Invalid startTimeMs' });
		}

		const spawnDoc = {
			lon: validateNumber(spawn.lon),
			lat: validateNumber(spawn.lat),
			alt: validateNumber(spawn.alt),
			heading: validateNumber(spawn.heading),
			pitch: validateNumber(spawn.pitch),
			roll: validateNumber(spawn.roll)
		};

		if (Object.values(spawnDoc).some((v) => v === null)) {
			return res.status(400).json({ error: 'Invalid spawn fields' });
		}

		const session = await GameSession.create({
			userId: req.user.id,
			spawn: spawnDoc,
			startTime
		});

		return res.json({ id: session._id.toString() });
	} catch {
		return res.status(500).json({ error: 'Failed to create session' });
	}
});

router.patch('/:id/end', requireAuth, async (req, res) => {
	try {
		const sessionId = req.params.id;
		const session = await GameSession.findById(sessionId);
		if (!session) return res.status(404).json({ error: 'Session not found' });

		if (session.userId.toString() !== req.user.id) {
			return res.status(403).json({ error: 'Forbidden' });
		}
		if (session.endTime) {
			return res.status(409).json({ error: 'Session already ended' });
		}

		const endReason = req.body?.endReason;
		const durationMs = req.body?.durationMs;
		const finalState = req.body?.finalState;

		const allowed = ['crashed', 'restart', 'quit', 'aborted'];
		if (!allowed.includes(endReason)) {
			return res.status(400).json({ error: 'Invalid endReason' });
		}
		const durationNum = durationMs == null ? null : Number(durationMs);

		if (durationNum != null && !Number.isFinite(durationNum)) {
			return res.status(400).json({ error: 'Invalid durationMs' });
		}
		if (!finalState) return res.status(400).json({ error: 'Missing finalState' });

		const finalStateDoc = {
			lon: validateNumber(finalState.lon),
			lat: validateNumber(finalState.lat),
			alt: validateNumber(finalState.alt),
			heading: validateNumber(finalState.heading),
			pitch: validateNumber(finalState.pitch),
			roll: validateNumber(finalState.roll),
			speed: validateNumber(finalState.speed)
		};

		if (Object.values(finalStateDoc).some((v) => v === null)) {
			return res.status(400).json({ error: 'Invalid finalState fields' });
		}

		session.endTime = new Date();
		session.durationMs = durationNum;
		session.endReason = endReason;
		session.finalState = finalStateDoc;

		await session.save();
		return res.json({ ok: true });
	} catch {
		return res.status(500).json({ error: 'Failed to end session' });
	}
});

// List ended sessions for the logged-in user (for game history).
router.get('/', requireAuth, async (req, res) => {
	try {
		const rawLimit = req.query?.limit;
		const limitNum = rawLimit == null ? 20 : Number(rawLimit);
		const limit = Number.isFinite(limitNum) ? Math.max(1, Math.min(50, limitNum)) : 20;

		const sessions = await GameSession.find({
			userId: req.user.id,
			endTime: { $ne: null }
		})
			.sort({ createdAt: -1 })
			.limit(limit)
			.select({
				spawn: 1,
				startTime: 1,
				endReason: 1,
				durationMs: 1
			});

		return res.json({
			sessions: sessions.map((s) => ({
				id: s._id.toString(),
				startTime: s.startTime ? s.startTime.toISOString() : null,
				endReason: s.endReason,
				durationMs: s.durationMs,
				spawn: s.spawn
			}))
		});
	} catch {
		return res.status(500).json({ error: 'Failed to load game history' });
	}
});

export default router;

