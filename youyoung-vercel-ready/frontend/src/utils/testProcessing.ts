import { TestResult, PersonalityProfile } from '../utils/types';

/**
 * Processes the psychological test results to generate a personality profile
 * @param results Array of test results from the psychological test
 * @returns PersonalityProfile object with personality traits and memories
 */
export const processTestResults = (results: TestResult[]): PersonalityProfile => {
  // Initialize personality traits with default values
  let openness = 3;
  let conscientiousness = 3;
  let extraversion = 3;
  let agreeableness = 3;
  let neuroticism = 3;
  
  // Arrays to store memories, aspirations and fears
  const memories: string[] = [];
  const aspirations: string[] = [];
  const fears: string[] = [];
  
  // Process each test result
  results.forEach(result => {
    const { questionId, answer } = result;
    
    // Process personality trait questions
    if (questionId.startsWith('openness')) {
      openness = Number(answer);
    } else if (questionId.startsWith('conscientiousness')) {
      conscientiousness = Number(answer);
    } else if (questionId.startsWith('extraversion')) {
      extraversion = Number(answer);
    } else if (questionId.startsWith('agreeableness')) {
      agreeableness = Number(answer);
    } else if (questionId.startsWith('neuroticism')) {
      neuroticism = Number(answer);
    }
    
    // Process memory questions
    else if (questionId.startsWith('childhood_memory')) {
      if (typeof answer === 'string' && answer.trim() !== '') {
        memories.push(answer.trim());
      }
    }
    
    // Process aspiration questions
    else if (questionId.startsWith('aspiration')) {
      if (typeof answer === 'string' && answer.trim() !== '') {
        aspirations.push(answer.trim());
      }
    }
    
    // Process fear questions
    else if (questionId.startsWith('fear')) {
      if (typeof answer === 'string' && answer.trim() !== '') {
        fears.push(answer.trim());
      }
    }
  });
  
  // Create and return the personality profile
  return {
    openness,
    conscientiousness,
    extraversion,
    agreeableness,
    neuroticism,
    memories,
    aspirations,
    fears
  };
};

/**
 * Generates a description of the personality based on the Big Five traits
 * @param profile PersonalityProfile object
 * @returns String description of the personality
 */
export const generatePersonalityDescription = (profile: PersonalityProfile): string => {
  const { openness, conscientiousness, extraversion, agreeableness, neuroticism } = profile;
  
  let description = '';
  
  // Openness description
  if (openness >= 4) {
    description += 'You were curious and open to new experiences. You had a vivid imagination and enjoyed exploring new ideas. ';
  } else if (openness <= 2) {
    description += 'You preferred routine and familiar experiences. You were practical and focused on concrete facts rather than abstract concepts. ';
  }
  
  // Conscientiousness description
  if (conscientiousness >= 4) {
    description += 'You were organized and detail-oriented. You liked to plan ahead and follow through with your commitments. ';
  } else if (conscientiousness <= 2) {
    description += 'You were spontaneous and flexible. You preferred to go with the flow rather than stick to rigid plans. ';
  }
  
  // Extraversion description
  if (extraversion >= 4) {
    description += 'You were outgoing and energetic. You enjoyed being around people and were often the life of the party. ';
  } else if (extraversion <= 2) {
    description += 'You were more reserved and enjoyed spending time alone or with close friends. You preferred deeper one-on-one conversations. ';
  }
  
  // Agreeableness description
  if (agreeableness >= 4) {
    description += 'You were compassionate and cared deeply about others. You tried to avoid conflict and maintain harmony. ';
  } else if (agreeableness <= 2) {
    description += 'You were direct and straightforward. You weren\'t afraid to challenge others or stand your ground. ';
  }
  
  // Neuroticism description
  if (neuroticism >= 4) {
    description += 'You experienced emotions intensely and were sensitive to stress. You worried about the future and were cautious in your decisions. ';
  } else if (neuroticism <= 2) {
    description += 'You were emotionally stable and resilient. You stayed calm under pressure and didn\'t worry too much about things. ';
  }
  
  return description;
};
