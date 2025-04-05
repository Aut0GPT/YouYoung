import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../utils/types';
import { AIPersonaConfig, formatAIMessage } from '../utils/aiPersona';

interface ChatInterfaceProps {
  personaConfig: AIPersonaConfig;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ personaConfig }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat with a greeting from the AI
  useEffect(() => {
    if (messages.length === 0 && personaConfig) {
      // Select a random conversation starter from the persona config
      const randomIndex = Math.floor(Math.random() * personaConfig.conversationStarters.length);
      const starterMessage = personaConfig.conversationStarters[randomIndex];
      
      // Add the starter message with a slight delay to simulate typing
      setIsTyping(true);
      setTimeout(() => {
        const formattedMessage = formatAIMessage(starterMessage, personaConfig);
        addMessage('ai', formattedMessage);
        setIsTyping(false);
      }, 1500);
    }
  }, [personaConfig]);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (sender: 'user' | 'ai', content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender,
      content,
      timestamp: Date.now()
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;
    
    // Add user message
    addMessage('user', inputMessage);
    setInputMessage('');
    
    // Simulate AI response
    simulateAIResponse(inputMessage);
  };

  const simulateAIResponse = (userMessage: string) => {
    // Start typing indicator
    setIsTyping(true);
    
    // In a real implementation, this would call an API to get a response from an LLM
    // For now, we'll simulate a response based on the user's message and persona config
    setTimeout(() => {
      let aiResponse = generateSimulatedResponse(userMessage, personaConfig);
      aiResponse = formatAIMessage(aiResponse, personaConfig);
      
      addMessage('ai', aiResponse);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000); // Random delay between 1.5-2.5 seconds
  };

  const generateSimulatedResponse = (userMessage: string, config: AIPersonaConfig): string => {
    // This is a simplified implementation for demonstration purposes
    // In a real app, this would call an LLM API with the persona configuration
    
    const lowerCaseMessage = userMessage.toLowerCase();
    
    // Check for questions about the past
    if (lowerCaseMessage.includes('remember') || lowerCaseMessage.includes('when you were')) {
      if (config.memories.length > 0) {
        const randomMemory = config.memories[Math.floor(Math.random() * config.memories.length)];
        return `Yes, I remember ${randomMemory}. That was such an important time for me.`;
      }
    }
    
    // Check for questions about dreams or aspirations
    if (lowerCaseMessage.includes('dream') || lowerCaseMessage.includes('want to be') || lowerCaseMessage.includes('aspire')) {
      if (config.aspirations.length > 0) {
        const randomAspiration = config.aspirations[Math.floor(Math.random() * config.aspirations.length)];
        return `I really want to ${randomAspiration}. It's my biggest dream right now. Did I ever achieve that?`;
      }
    }
    
    // Check for questions about fears
    if (lowerCaseMessage.includes('afraid') || lowerCaseMessage.includes('fear') || lowerCaseMessage.includes('scary')) {
      if (config.fears.length > 0) {
        const randomFear = config.fears[Math.floor(Math.random() * config.fears.length)];
        return `I'm kind of afraid of ${randomFear}. Does that ever go away?`;
      }
    }
    
    // Check for questions about the future
    if (lowerCaseMessage.includes('future') || lowerCaseMessage.includes('grow up') || lowerCaseMessage.includes('older')) {
      return "I'm really curious about what happens in the future. What's it like being older? Have things worked out the way I hoped?";
    }
    
    // Default responses based on personality
    const defaultResponses = [
      "That's interesting to hear. Tell me more about your life now.",
      "I've been wondering about that too. What else has changed since I was younger?",
      "I'm still trying to figure things out. What advice would you give to your younger self?",
      "It's so strange talking to my future self. What's the most important thing you've learned since you were my age?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h2>Chat with Your Younger Self</h2>
        <p className="persona-description">{personaConfig.personalityDescription}</p>
      </div>
      
      <div className="messages-container">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
          >
            <div className="message-content">{message.content}</div>
            <div className="message-timestamp">{formatTimestamp(message.timestamp)}</div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message ai-message typing">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="input-container">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type your message..."
          disabled={isTyping}
        />
        <button 
          onClick={handleSendMessage}
          disabled={inputMessage.trim() === '' || isTyping}
        >
          Send
        </button>
      </div>
      
      <style jsx>{`
        .chat-interface {
          display: flex;
          flex-direction: column;
          height: 100%;
          max-width: 600px;
          margin: 0 auto;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .chat-header {
          background-color: #784be8;
          color: white;
          padding: 15px;
          text-align: center;
        }
        
        .chat-header h2 {
          margin: 0;
          font-size: 1.5rem;
        }
        
        .persona-description {
          font-size: 0.8rem;
          margin-top: 5px;
          opacity: 0.9;
        }
        
        .messages-container {
          flex: 1;
          padding: 15px;
          overflow-y: auto;
          background-color: #f8f9fa;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .message {
          max-width: 80%;
          padding: 10px 15px;
          border-radius: 18px;
          position: relative;
          word-wrap: break-word;
        }
        
        .user-message {
          align-self: flex-end;
          background-color: #784be8;
          color: white;
          border-bottom-right-radius: 4px;
        }
        
        .ai-message {
          align-self: flex-start;
          background-color: #e9e9eb;
          color: #333;
          border-bottom-left-radius: 4px;
        }
        
        .message-timestamp {
          font-size: 0.7rem;
          opacity: 0.7;
          margin-top: 5px;
          text-align: right;
        }
        
        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 3px;
        }
        
        .typing-indicator span {
          width: 8px;
          height: 8px;
          background-color: #999;
          border-radius: 50%;
          display: inline-block;
          animation: bounce 1.3s linear infinite;
        }
        
        .typing-indicator span:nth-child(2) {
          animation-delay: 0.15s;
        }
        
        .typing-indicator span:nth-child(3) {
          animation-delay: 0.3s;
        }
        
        @keyframes bounce {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-4px);
          }
        }
        
        .input-container {
          display: flex;
          padding: 10px;
          background-color: white;
          border-top: 1px solid #e0e0e0;
        }
        
        .input-container input {
          flex: 1;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 20px;
          font-size: 16px;
          outline: none;
        }
        
        .input-container button {
          background-color: #784be8;
          color: white;
          border: none;
          border-radius: 20px;
          padding: 0 20px;
          margin-left: 10px;
          cursor: pointer;
          font-size: 16px;
        }
        
        .input-container button:disabled {
          background-color: #b3a3e0;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default ChatInterface;
