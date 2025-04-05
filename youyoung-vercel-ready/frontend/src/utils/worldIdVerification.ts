import { MiniKit, VerificationLevel } from '@worldcoin/minikit-js';
import { VerifyCommandInput, MiniAppVerifyActionSuccessPayload, IVerifyResponse } from '../utils/types';

/**
 * Handles World ID verification process
 * @param action The action ID from the Developer Portal
 * @param signal Optional additional data
 * @param verificationLevel The verification level (defaults to Orb)
 * @returns Promise with verification result
 */
export const handleWorldIDVerification = async (
  action: string,
  signal?: string,
  verificationLevel: VerificationLevel = VerificationLevel.Orb
): Promise<IVerifyResponse> => {
  try {
    // Check if MiniKit is installed
    if (!MiniKit.isInstalled()) {
      return {
        success: false,
        message: 'MiniKit is not installed. Please open this app in World App.'
      };
    }

    // Prepare verification payload
    const verifyPayload: VerifyCommandInput = {
      action,
      signal,
      verification_level: verificationLevel
    };

    // World App will open a drawer prompting the user to confirm the operation
    const finalPayload = await MiniKit.commandsAsync.verify(verifyPayload);
    
    // Check for errors
    if (finalPayload.status === 'error') {
      console.log('Error payload', finalPayload);
      return {
        success: false,
        message: 'Verification failed. Please try again.'
      };
    }

    // Verify the proof in the backend
    const verifyResponse = await fetch('/api/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payload: finalPayload as MiniAppVerifyActionSuccessPayload,
        action,
        signal
      }),
    });

    const verifyResponseJson = await verifyResponse.json();
    
    if (verifyResponse.status === 200) {
      console.log('Verification success!');
      return {
        success: true,
        data: verifyResponseJson
      };
    } else {
      console.log('Backend verification failed', verifyResponseJson);
      return {
        success: false,
        message: verifyResponseJson.message || 'Verification failed on the server.'
      };
    }
  } catch (error) {
    console.error('Verification error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred during verification.'
    };
  }
};
