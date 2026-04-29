import mongoose from 'mongoose';

const spawnSchema = new mongoose.Schema(
	{
		lon: { type: Number, required: true },
		lat: { type: Number, required: true },
		alt: { type: Number, required: true },
		heading: { type: Number, required: true },
		pitch: { type: Number, required: true },
		roll: { type: Number, required: true }
	},
	{ _id: false }
);

const finalStateSchema = new mongoose.Schema(
	{
		lon: { type: Number, required: true },
		lat: { type: Number, required: true },
		alt: { type: Number, required: true },
		heading: { type: Number, required: true },
		pitch: { type: Number, required: true },
		roll: { type: Number, required: true },
		speed: { type: Number, required: true }
	},
	{ _id: false }
);

const gameSessionSchema = new mongoose.Schema(
	{
		userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true, ref: 'User' },

		spawn: { type: spawnSchema, required: true },

		startTime: { type: Date, required: true },

		endTime: { type: Date, default: null },
		durationMs: { type: Number, default: null },
		endReason: {
			type: String,
			enum: ['crashed', 'restart', 'quit', 'aborted'],
			default: null
		},

		finalState: { type: finalStateSchema, default: null }
	},
	{
		timestamps: true
	}
);

gameSessionSchema.index({ userId: 1, createdAt: -1 });

export const GameSession = mongoose.model('GameSession', gameSessionSchema);

