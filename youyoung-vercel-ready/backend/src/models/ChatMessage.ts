import mongoose, { Document, Schema } from 'mongoose';

// Interface for the chat message document
export interface IChatMessage extends Document {
  userId: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

// Schema for chat messages
const ChatMessageSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  sender: {
    type: String,
    enum: ['user', 'ai'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Create and export the ChatMessage model
export default mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);
