import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../utils/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { proof, action } = req.body;
    
    if (!proof || !action) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters'
      });
    }
    
    // Get app_id from environment variables
    const app_id = process.env.NEXT_PUBLIC_APP_ID || 'app_b636a7e558dec2f33f8a449094f7b35e';
    
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
      await connectToDatabase();
      
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
}
