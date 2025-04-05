import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../utils/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { nullifierHash, message } = req.body;
    
    if (!nullifierHash || !message) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters'
      });
    }
    
    // Connect to database
    await connectToDatabase();
    
    // In a real implementation, this would call an LLM API with the persona configuration
    // For now, we'll generate a simple response
    const responses = [
      "That's really interesting! I've always wondered what my future would be like.",
      "I'm still trying to figure things out. What advice would you give to your younger self?",
      "I remember thinking about that a lot when I was younger. How did things turn out for you?",
      "That's not what I expected to hear about my future! Tell me more.",
      "I have so many questions about what happens next in my life. Did I achieve my dreams?",
      "It's strange talking to my future self. What's the most important lesson you've learned since you were my age?"
    ];
    
    // Return a random response
    const aiResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return res.status(200).json({
      success: true,
      data: {
        userMessage: {
          id: Date.now().toString(),
          content: message,
          timestamp: new Date()
        },
        aiMessage: {
          id: (Date.now() + 1).toString(),
          content: aiResponse,
          timestamp: new Date()
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
}
