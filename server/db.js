import mongoose from 'mongoose';

let hasConnected = false;

export async function connectToMongo() {
	if (hasConnected && mongoose.connection.readyState === 1) return;

	const uri = process.env.MONGODB_URI;
	if (!uri) {
		throw new Error('Missing required env var: MONGODB_URI');
	}

	await mongoose.connect(uri);
	hasConnected = true;
}

