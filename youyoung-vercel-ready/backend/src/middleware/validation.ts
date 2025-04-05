import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to validate World ID verification request
 */
export const validateWorldIDRequest = (req: Request, res: Response, next: NextFunction) => {
  const { payload, action } = req.body;
  
  if (!payload) {
    return res.status(400).json({
      success: false,
      message: 'Missing payload parameter'
    });
  }
  
  if (!action) {
    return res.status(400).json({
      success: false,
      message: 'Missing action parameter'
    });
  }
  
  if (!payload.proof || !payload.merkle_root || !payload.nullifier_hash || !payload.verification_level) {
    return res.status(400).json({
      success: false,
      message: 'Incomplete payload data'
    });
  }
  
  next();
};

/**
 * Middleware to validate test results request
 */
export const validateTestResultsRequest = (req: Request, res: Response, next: NextFunction) => {
  const { nullifierHash, testResults } = req.body;
  
  if (!nullifierHash) {
    return res.status(400).json({
      success: false,
      message: 'Missing nullifierHash parameter'
    });
  }
  
  if (!testResults) {
    return res.status(400).json({
      success: false,
      message: 'Missing testResults parameter'
    });
  }
  
  // Validate personality traits
  const traits = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];
  for (const trait of traits) {
    if (typeof testResults[trait] !== 'number' || testResults[trait] < 1 || testResults[trait] > 5) {
      return res.status(400).json({
        success: false,
        message: `Invalid ${trait} value. Must be a number between 1 and 5.`
      });
    }
  }
  
  // Validate arrays
  const arrays = ['memories', 'aspirations', 'fears'];
  for (const array of arrays) {
    if (!Array.isArray(testResults[array])) {
      return res.status(400).json({
        success: false,
        message: `Invalid ${array} value. Must be an array.`
      });
    }
  }
  
  next();
};

/**
 * Middleware to validate chat message request
 */
export const validateChatMessageRequest = (req: Request, res: Response, next: NextFunction) => {
  const { nullifierHash, message } = req.body;
  
  if (!nullifierHash) {
    return res.status(400).json({
      success: false,
      message: 'Missing nullifierHash parameter'
    });
  }
  
  if (!message) {
    return res.status(400).json({
      success: false,
      message: 'Missing message parameter'
    });
  }
  
  if (typeof message !== 'string' || message.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Message cannot be empty'
    });
  }
  
  next();
};
