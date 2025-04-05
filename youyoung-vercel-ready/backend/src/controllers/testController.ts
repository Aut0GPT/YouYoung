import { Request, Response } from 'express';
import User from '../models/User';

// Interface for the test result request
interface ITestResultRequest {
  nullifierHash: string;
  testResults: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
    memories: string[];
    aspirations: string[];
    fears: string[];
  };
}

/**
 * Store psychological test results for a user
 * @param req Express request object
 * @param res Express response object
 */
export const storeTestResults = async (req: Request, res: Response) => {
  try {
    const { nullifierHash, testResults } = req.body as ITestResultRequest;
    
    if (!nullifierHash || !testResults) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters'
      });
    }
    
    // Find the user by nullifier hash
    const user = await User.findOne({ worldIdNullifierHash: nullifierHash });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please verify with World ID first.'
      });
    }
    
    // Update the user's personality profile
    user.personalityProfile = {
      openness: testResults.openness,
      conscientiousness: testResults.conscientiousness,
      extraversion: testResults.extraversion,
      agreeableness: testResults.agreeableness,
      neuroticism: testResults.neuroticism,
      memories: testResults.memories,
      aspirations: testResults.aspirations,
      fears: testResults.fears
    };
    
    // Save the updated user
    await user.save();
    
    return res.status(200).json({
      success: true,
      message: 'Test results stored successfully',
      data: {
        nullifierHash,
        personalityProfile: user.personalityProfile
      }
    });
  } catch (error) {
    console.error('Error storing test results:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while storing test results',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get a user's personality profile
 * @param req Express request object
 * @param res Express response object
 */
export const getPersonalityProfile = async (req: Request, res: Response) => {
  try {
    const { nullifierHash } = req.params;
    
    if (!nullifierHash) {
      return res.status(400).json({
        success: false,
        message: 'Missing nullifier hash parameter'
      });
    }
    
    // Find the user by nullifier hash
    const user = await User.findOne({ worldIdNullifierHash: nullifierHash });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if the user has a personality profile
    if (!user.personalityProfile) {
      return res.status(404).json({
        success: false,
        message: 'Personality profile not found for this user'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: {
        nullifierHash,
        personalityProfile: user.personalityProfile
      }
    });
  } catch (error) {
    console.error('Error retrieving personality profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while retrieving personality profile',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
