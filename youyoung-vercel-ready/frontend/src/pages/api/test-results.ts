import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../utils/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { nullifierHash, testResults } = req.body;
    
    if (!nullifierHash || !testResults) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters'
      });
    }
    
    // Connect to database
    await connectToDatabase();
    
    // In a real implementation, we would store the test results in the database
    // For this demo, we'll just return success
    
    return res.status(200).json({
      success: true,
      message: 'Test results stored successfully',
      data: {
        nullifierHash,
        personalityProfile: testResults
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
}
