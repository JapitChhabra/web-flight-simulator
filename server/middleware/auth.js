import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).json({ error: 'Missing Authorization header' });
	}

	const token = authHeader.slice('Bearer '.length);

	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		// `sub` is the user id (see token generation below).
		req.user = { id: payload.sub, username: payload.username };
		return next();
	} catch {
		return res.status(401).json({ error: 'Invalid or expired token' });
	}
}

