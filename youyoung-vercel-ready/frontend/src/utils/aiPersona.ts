import { PersonalityProfile } from '../utils/types';

/**
 * Interface for AI persona configuration
 */
export interface AIPersonaConfig {
  toneStyle: string;
  languageComplexity: 'simple' | 'moderate' | 'complex';
  emotionalExpression: 'reserved' | 'balanced' | 'expressive';
  interestTopics: string[];
  memories: string[];
  aspirations: string[];
  fears: string[];
  personalityDescription: string;
  conversationStarters: string[];
}

/**
 * Generates an AI persona configuration based on the personality profile
 * @param profile PersonalityProfile from test results
 * @returns AIPersonaConfig for the chat interface
 */
export const generateAIPersona = (profile: PersonalityProfile): AIPersonaConfig => {
  const {
    openness,
    conscientiousness,
    extraversion,
    agreeableness,
    neuroticism,
    memories,
    aspirations,
    fears
  } = profile;
  
  // Determine tone style based on personality traits
  let toneStyle = '';
  if (extraversion >= 4) {
    toneStyle += 'enthusiastic, energetic, ';
  } else if (extraversion <= 2) {
    toneStyle += 'thoughtful, reserved, ';
  }
  
  if (agreeableness >= 4) {
    toneStyle += 'warm, friendly, ';
  } else if (agreeableness <= 2) {
    toneStyle += 'direct, straightforward, ';
  }
  
  if (neuroticism >= 4) {
    toneStyle += 'emotional, cautious, ';
  } else if (neuroticism <= 2) {
    toneStyle += 'calm, confident, ';
  }
  
  if (openness >= 4) {
    toneStyle += 'curious, imaginative';
  } else if (openness <= 2) {
    toneStyle += 'practical, conventional';
  }
  
  // Determine language complexity based on openness and conscientiousness
  let languageComplexity: 'simple' | 'moderate' | 'complex';
  const complexityScore = (openness + conscientiousness) / 2;
  if (complexityScore >= 4) {
    languageComplexity = 'complex';
  } else if (complexityScore >= 2.5) {
    languageComplexity = 'moderate';
  } else {
    languageComplexity = 'simple';
  }
  
  // Determine emotional expression based on extraversion and neuroticism
  let emotionalExpression: 'reserved' | 'balanced' | 'expressive';
  const expressionScore = (extraversion + neuroticism) / 2;
  if (expressionScore >= 4) {
    emotionalExpression = 'expressive';
  } else if (expressionScore >= 2.5) {
    emotionalExpression = 'balanced';
  } else {
    emotionalExpression = 'reserved';
  }
  
  // Generate interest topics based on personality traits
  const interestTopics: string[] = [];
  
  if (openness >= 3) {
    interestTopics.push('art', 'music', 'literature', 'philosophy', 'science');
  }
  
  if (conscientiousness >= 3) {
    interestTopics.push('organization', 'planning', 'achievement', 'goals');
  }
  
  if (extraversion >= 3) {
    interestTopics.push('social events', 'parties', 'group activities', 'sports');
  }
  
  if (agreeableness >= 3) {
    interestTopics.push('helping others', 'community', 'relationships', 'cooperation');
  }
  
  if (neuroticism >= 3) {
    interestTopics.push('emotions', 'self-improvement', 'stress management');
  }
  
  // Generate conversation starters based on personality and memories
  const conversationStarters = [
    "Hey there! It's like looking into the future. What's life like for you now?",
    "I've been wondering what becomes of me. What are you up to these days?",
    "This is so weird but cool! What would you like to talk about?",
    "I have so many questions about the future. Can you tell me if any of my dreams came true?"
  ];
  
  // Add memory-based conversation starters
  if (memories.length > 0) {
    memories.forEach(memory => {
      conversationStarters.push(`I was just thinking about ${memory}. Do you still remember that?`);
    });
  }
  
  // Add aspiration-based conversation starters
  if (aspirations.length > 0) {
    aspirations.forEach(aspiration => {
      conversationStarters.push(`I really want to ${aspiration}. Did I ever get to do that?`);
    });
  }
  
  // Generate a personality description
  const personalityDescription = generatePersonalityDescription(profile);
  
  return {
    toneStyle: toneStyle.trim(),
    languageComplexity,
    emotionalExpression,
    interestTopics,
    memories,
    aspirations,
    fears,
    personalityDescription,
    conversationStarters
  };
};

/**
 * Generates a description of the personality based on the Big Five traits
 * @param profile PersonalityProfile object
 * @returns String description of the personality
 */
const generatePersonalityDescription = (profile: PersonalityProfile): string => {
  const { openness, conscientiousness, extraversion, agreeableness, neuroticism } = profile;
  
  let description = '';
  
  // Openness description
  if (openness >= 4) {
    description += 'You were curious and open to new experiences. You had a vivid imagination and enjoyed exploring new ideas. ';
  } else if (openness <= 2) {
    description += 'You preferred routine and familiar experiences. You were practical and focused on concrete facts rather than abstract concepts. ';
  } else {
    description += 'You had a balance between curiosity and practicality. You appreciated both new ideas and established traditions. ';
  }
  
  // Conscientiousness description
  if (conscientiousness >= 4) {
    description += 'You were organized and detail-oriented. You liked to plan ahead and follow through with your commitments. ';
  } else if (conscientiousness <= 2) {
    description += 'You were spontaneous and flexible. You preferred to go with the flow rather than stick to rigid plans. ';
  } else {
    description += 'You had a moderate approach to organization and planning. You could be structured when needed but also adaptable to change. ';
  }
  
  // Extraversion description
  if (extraversion >= 4) {
    description += 'You were outgoing and energetic. You enjoyed being around people and were often the life of the party. ';
  } else if (extraversion <= 2) {
    description += 'You were more reserved and enjoyed spending time alone or with close friends. You preferred deeper one-on-one conversations. ';
  } else {
    description += 'You had a balance between social energy and personal reflection. You enjoyed both group activities and quiet time alone. ';
  }
  
  // Agreeableness description
  if (agreeableness >= 4) {
    description += 'You were compassionate and cared deeply about others. You tried to avoid conflict and maintain harmony. ';
  } else if (agreeableness <= 2) {
    description += 'You were direct and straightforward. You weren\'t afraid to challenge others or stand your ground. ';
  } else {
    description += 'You had a balanced approach to social interactions. You could be cooperative but also assertive when needed. ';
  }
  
  // Neuroticism description
  if (neuroticism >= 4) {
    description += 'You experienced emotions intensely and were sensitive to stress. You worried about the future and were cautious in your decisions. ';
  } else if (neuroticism <= 2) {
    description += 'You were emotionally stable and resilient. You stayed calm under pressure and didn\'t worry too much about things. ';
  } else {
    description += 'You had a moderate emotional sensitivity. You could feel things deeply but also maintain perspective and balance. ';
  }
  
  return description;
};

/**
 * Formats a message from the AI persona based on its configuration
 * @param message The raw message content
 * @param config The AI persona configuration
 * @returns Formatted message string
 */
export const formatAIMessage = (message: string, config: AIPersonaConfig): string => {
  let formattedMessage = message;
  
  // Apply language complexity adjustments
  if (config.languageComplexity === 'simple') {
    // Simplify language (in a real implementation, this would use more sophisticated NLP)
    formattedMessage = simplifyLanguage(formattedMessage);
  } else if (config.languageComplexity === 'complex') {
    // Make language more sophisticated (in a real implementation, this would use more sophisticated NLP)
    formattedMessage = enhanceLanguage(formattedMessage);
  }
  
  // Apply emotional expression adjustments
  if (config.emotionalExpression === 'expressive') {
    // Add more emotional markers
    formattedMessage = addEmotionalMarkers(formattedMessage);
  } else if (config.emotionalExpression === 'reserved') {
    // Tone down emotional markers
    formattedMessage = reduceEmotionalMarkers(formattedMessage);
  }
  
  return formattedMessage;
};

// Helper functions for message formatting
// These are simplified implementations - in a real app, these would use more sophisticated NLP

const simplifyLanguage = (text: string): string => {
  // This is a simplified implementation
  return text
    .replace(/utilize/g, 'use')
    .replace(/commence/g, 'start')
    .replace(/nevertheless/g, 'still')
    .replace(/subsequently/g, 'later')
    .replace(/approximately/g, 'about');
};

const enhanceLanguage = (text: string): string => {
  // This is a simplified implementation
  return text
    .replace(/use/g, 'utilize')
    .replace(/start/g, 'commence')
    .replace(/still/g, 'nevertheless')
    .replace(/later/g, 'subsequently')
    .replace(/about/g, 'approximately');
};

const addEmotionalMarkers = (text: string): string => {
  // This is a simplified implementation
  // In a real app, this would be more sophisticated
  if (!text.includes('!') && Math.random() > 0.7) {
    text = text.replace(/\./g, '!');
  }
  
  // Add emotional interjections
  if (Math.random() > 0.8) {
    const interjections = ['Wow, ', 'Oh my gosh, ', 'Seriously, ', 'I can\'t believe it, '];
    const randomInterjection = interjections[Math.floor(Math.random() * interjections.length)];
    text = randomInterjection + text.charAt(0).toLowerCase() + text.slice(1);
  }
  
  return text;
};

const reduceEmotionalMarkers = (text: string): string => {
  // This is a simplified implementation
  return text
    .replace(/!/g, '.')
    .replace(/Wow, /g, '')
    .replace(/Oh my gosh, /g, '')
    .replace(/Seriously, /g, '')
    .replace(/I can't believe it, /g, '');
};
