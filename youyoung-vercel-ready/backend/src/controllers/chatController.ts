import { Request, Response } from 'express';
import ChatMessage from '../models/ChatMessage';

// Interface for the chat message request
interface IChatMessageRequest {
  nullifierHash: string;
  message: string;
}

/**
 * Store a user message and generate an AI response
 * @param req Express request object
 * @param res Express response object
 */
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { nullifierHash, message } = req.body as IChatMessageRequest;
    
    if (!nullifierHash || !message) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters'
      });
    }
    
    // Store the user message
    const userMessage = new ChatMessage({
      userId: nullifierHash,
      sender: 'user',
      content: message,
      timestamp: new Date()
    });
    
    await userMessage.save();
    
    // In a real implementation, this would call an LLM API with the persona configuration
    // For now, we'll generate a simple response
    const aiResponse = await generateAIResponse(nullifierHash, message);
    
    // Store the AI response
    const aiMessage = new ChatMessage({
      userId: nullifierHash,
      sender: 'ai',
      content: aiResponse,
      timestamp: new Date()
    });
    
    await aiMessage.save();
    
    return res.status(200).json({
      success: true,
      data: {
        userMessage: {
          id: userMessage._id,
          content: userMessage.content,
          timestamp: userMessage.timestamp
        },
        aiMessage: {
          id: aiMessage._id,
          content: aiMessage.content,
          timestamp: aiMessage.timestamp
        }
      }
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while sending message',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get chat history for a user
 * @param req Express request object
 * @param res Express response object
 */
export const getChatHistory = async (req: Request, res: Response) => {
  try {
    const { nullifierHash } = req.params;
    const { limit = 50, before } = req.query;
    
    if (!nullifierHash) {
      return res.status(400).json({
        success: false,
        message: 'Missing nullifier hash parameter'
      });
    }
    
    // Build query
    const query: any = { userId: nullifierHash };
    
    // If 'before' timestamp is provided, get messages before that time
    if (before) {
      query.timestamp = { $lt: new Date(before as string) };
    }
    
    // Get messages, sorted by timestamp
    const messages = await ChatMessage.find(query)
      .sort({ timestamp: -1 })
      .limit(Number(limit))
      .lean();
    
    return res.status(200).json({
      success: true,
      data: {
        messages: messages.map(msg => ({
          id: msg._id,
          sender: msg.sender,
          content: msg.content,
          timestamp: msg.timestamp
        })),
        hasMore: messages.length === Number(limit)
      }
    });
  } catch (error) {
    console.error('Error retrieving chat history:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while retrieving chat history',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Generate an AI response based on user message and personality profile
 * @param nullifierHash User identifier
 * @param userMessage Message from the user
 * @returns AI response message
 */
const generateAIResponse = async (nullifierHash: string, userMessage: string): Promise<string> => {
  // In a real implementation, this would:
  // 1. Fetch the user's personality profile from the database
  // 2. Use the profile to configure an LLM prompt
  // 3. Call an LLM API (like OpenAI) to generate a response
  // 4. Format the response according to the personality traits
  
  // For this demo, we'll return a simple response
  const responses = [
    "That's really interesting! I've always wondered what my future would be like.",
    "I'm still trying to figure things out. What advice would you give to your younger self?",
    "I remember thinking about that a lot when I was younger. How did things turn out for you?",
    "That's not what I expected to hear about my future! Tell me more.",
    "I have so many questions about what happens next in my life. Did I achieve my dreams?",
    "It's strange talking to my future self. What's the most important lesson you've learned since you were my age?"
  ];
  
  // Simulate a delay for a more realistic experience
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return a random response
  return responses[Math.floor(Math.random() * responses.length)];
};
