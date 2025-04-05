import mongoose, { Document, Schema } from 'mongoose';

// Interface for the user document
export interface IUser extends Document {
  worldIdNullifierHash: string;
  isVerified: boolean;
  personalityProfile?: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
    memories: string[];
    aspirations: string[];
    fears: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

// Schema for the user
const UserSchema: Schema = new Schema({
  worldIdNullifierHash: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  personalityProfile: {
    openness: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    },
    conscientiousness: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    },
    extraversion: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    },
    agreeableness: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    },
    neuroticism: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    },
    memories: {
      type: [String],
      default: []
    },
    aspirations: {
      type: [String],
      default: []
    },
    fears: {
      type: [String],
      default: []
    }
  }
}, {
  timestamps: true
});

// Create and export the User model
export default mongoose.model<IUser>('User', UserSchema);
