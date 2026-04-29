const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
const AUTH_TOKEN_KEY = 'fs_auth_token';

function getAuthToken() {
	return localStorage.getItem(AUTH_TOKEN_KEY);
}

function buildHeaders() {
	const headers = { 'Content-Type': 'application/json' };
	const token = getAuthToken();
	if (token) headers.Authorization = `Bearer ${token}`;
	return headers;
}

async function request(path, options = {}) {
	const url = `${API_BASE_URL}${path}`;
	const response = await fetch(url, {
		...options,
		headers: {
			...buildHeaders(),
			...(options.headers || {})
		}
	});

	let data = null;
	try {
		data = await response.json();
	} catch {
		// ignore non-json responses
	}

	if (!response.ok) {
		const message = data?.error || `Request failed: ${response.status}`;
		const err = new Error(message);
		err.status = response.status;
		err.data = data;
		throw err;
	}

	return data;
}

export const api = {
	async signup(username, password) {
		return request('/api/auth/signup', {
			method: 'POST',
			body: JSON.stringify({ username, password })
		});
	},

	async login(username, password) {
		return request('/api/auth/login', {
			method: 'POST',
			body: JSON.stringify({ username, password })
		});
	},

	async me() {
		return request('/api/auth/me', { method: 'GET' });
	},

	async startGameSession({ spawn, startTimeMs }) {
		return request('/api/game-sessions/start', {
			method: 'POST',
			body: JSON.stringify({ spawn, startTimeMs })
		});
	},

	async endGameSession({ id, endReason, durationMs, finalState }) {
		return request(`/api/game-sessions/${id}/end`, {
			method: 'PATCH',
			body: JSON.stringify({ endReason, durationMs, finalState })
		});
	},

	async listGameSessions({ limit = 20 } = {}) {
		return request(`/api/game-sessions?limit=${encodeURIComponent(limit)}`, { method: 'GET' });
	},

	clearToken() {
		localStorage.removeItem(AUTH_TOKEN_KEY);
	},

	setToken(token) {
		localStorage.setItem(AUTH_TOKEN_KEY, token);
	}
};

