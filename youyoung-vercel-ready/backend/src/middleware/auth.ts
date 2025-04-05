import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

/**
 * Middleware to check if a user is verified with World ID
 */
export const verifyUserAuthentication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get nullifier hash from request body or params
    const nullifierHash = req.body.nullifierHash || req.params.nullifierHash;
    
    if (!nullifierHash) {
      return res.status(400).json({
        success: false,
        message: 'Missing nullifier hash'
      });
    }
    
    // Find user by nullifier hash
    const user = await User.findOne({ worldIdNullifierHash: nullifierHash });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please verify with World ID first.'
      });
    }
    
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'User is not verified. Please complete World ID verification first.'
      });
    }
    
    // Add user to request object for use in controllers
    (req as any).user = user;
    
    next();
  } catch (error) {
    console.error('Error in authentication middleware:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication check',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
