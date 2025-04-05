"use client"
import React, { useState } from 'react';
import { IDKitWidget, VerificationLevel } from '@worldcoin/idkit';

interface WorldIDVerificationProps {
  onVerificationSuccess: (nullifierHash: string) => void;
  onVerificationFailure: (error: string) => void;
}

const WorldIDVerification: React.FC<WorldIDVerificationProps> = ({
  onVerificationSuccess,
  onVerificationFailure
}) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verify proof on the server
  const verifyProof = async (proof: any) => {
    try {
      setIsVerifying(true);
      
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          proof,
          action: process.env.NEXT_PUBLIC_ACTION || 'youyoung-member'
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        return true;
      } else {
        throw new Error(data.message || 'Verification failed on the server');
      }
    } catch (error) {
      console.error('Error verifying proof:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during verification';
      onVerificationFailure(errorMessage);
      setError(errorMessage);
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle successful verification
  const handleSuccess = (result: any) => {
    console.log("Verification successful!", result);
    // The nullifier_hash uniquely identifies the user
    if (result.nullifier_hash) {
      onVerificationSuccess(result.nullifier_hash);
    } else {
      onVerificationSuccess('verified_user');
    }
  };

  return (
    <div className="world-id-verification">
      <h2>World ID Verification</h2>
      <p>
        To access the chat with your younger self, please verify your identity using World ID.
      </p>
      
      <IDKitWidget
        app_id={process.env.NEXT_PUBLIC_APP_ID || 'app_b636a7e558dec2f33f8a449094f7b35e'}
        action={process.env.NEXT_PUBLIC_ACTION || 'youyoung-member'}
        onSuccess={handleSuccess}
        handleVerify={verifyProof}
        verification_level={VerificationLevel.Device}
      >
        {({ open }) => (
          <button 
            onClick={open} 
            disabled={isVerifying}
            className="verification-button"
          >
            {isVerifying ? 'Verifying...' : 'Verify with World ID'}
          </button>
        )}
      </IDKitWidget>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <style jsx>{`
        .world-id-verification {
          padding: 20px;
          border-radius: 8px;
          background-color: #f8f9fa;
          max-width: 500px;
          margin: 0 auto;
          text-align: center;
        }
        
        .verification-button {
          background-color: #784be8;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          margin-top: 20px;
        }
        
        .verification-button:disabled {
          background-color: #b3a3e0;
          cursor: not-allowed;
        }
        
        .error-message {
          color: #e74c3c;
          margin-top: 16px;
        }
      `}</style>
    </div>
  );
};

export default WorldIDVerification;
