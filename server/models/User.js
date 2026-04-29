import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			index: true
		},
		passwordHash: {
			type: String,
			required: true
		}
	},
	{
		timestamps: true,
		toJSON: {
			transform: (_doc, ret) => {
				delete ret.passwordHash;
				return ret;
			}
		}
	}
);

export const User = mongoose.model('User', userSchema);

