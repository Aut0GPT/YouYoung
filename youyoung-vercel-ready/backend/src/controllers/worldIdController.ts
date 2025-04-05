import { Request, Response } from 'express';

// Interface for the verification request payload from IDKit
interface IVerificationRequest {
  proof: {
    merkle_root: string;
    nullifier_hash: string;
    proof: string;
    verification_level: string;
  };
  action: string;
  signal?: string;
}

/**
 * Verify World ID proof
 * @param req Express request object
 * @param res Express response object
 */
export const verifyWorldID = async (req: Request, res: Response) => {
  try {
    const { proof, action } = req.body as IVerificationRequest;
    
    if (!proof || !action) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters'
      });
    }
    
    // Get app_id and client_secret from environment variables
    const app_id = process.env.WORLD_APP_ID || 'app_b636a7e558dec2f33f8a449094f7b35e';
    
    // Verify the proof using the World ID API
    const response = await fetch('https://developer.worldcoin.org/api/v2/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        ...proof,
        app_id,
        action
      }),
    });
    
    const verifyResult = await response.json();
    
    if (response.ok && verifyResult.verified) {
      // If verification is successful, you can perform additional actions here
      // Such as marking a user as verified in your database
      
      return res.status(200).json({
        success: true,
        message: 'Verification successful',
        data: {
          verified: true,
          nullifier_hash: proof.nullifier_hash
        }
      });
    } else {
      // If verification fails
      return res.status(400).json({
        success: false,
        message: 'Verification failed',
        error: verifyResult.code || verifyResult.detail || 'Unknown error'
      });
    }
  } catch (error) {
    console.error('Error verifying World ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during verification',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
