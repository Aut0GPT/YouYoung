"use client"
import React, { useState } from 'react';
import { IDKitWidget, VerificationLevel } from '@worldcoin/idkit';
import PsychologicalTest from '../components/PsychologicalTest';
import ChatInterface from '../components/ChatInterface';
import { TestResult, PersonalityProfile } from '../utils/types';
import { processTestResults } from '../utils/testProcessing';
import { generateAIPersona, AIPersonaConfig } from '../utils/aiPersona';

const Home: React.FC = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [nullifierHash, setNullifierHash] = useState<string | null>(null);
  const [testCompleted, setTestCompleted] = useState(false);
  const [personaConfig, setPersonaConfig] = useState<AIPersonaConfig | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Verify proof on the server
  const verifyProof = async (proof: any) => {
    try {
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
      setError(error instanceof Error ? error.message : 'Unknown error during verification');
      return false;
    }
  };

  // Handle successful verification
  const handleSuccess = (result: any) => {
    console.log("Verification successful!", result);
    setIsVerified(true);
    // The nullifier_hash uniquely identifies the user
    if (result.nullifier_hash) {
      setNullifierHash(result.nullifier_hash);
    } else {
      setNullifierHash('verified_user');
    }
    setError(null);
  };

  const handleTestComplete = async (results: TestResult[]) => {
    try {
      // Process test results locally
      const personalityProfile: PersonalityProfile = processTestResults(results);
      
      // Generate AI persona configuration
      const aiPersona = generateAIPersona(personalityProfile);
      setPersonaConfig(aiPersona);
      
      // Store results in backend
      if (nullifierHash) {
        const response = await fetch('/api/test-results', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nullifierHash,
            testResults: personalityProfile
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to store test results');
        }
      }
      
      setTestCompleted(true);
      setError(null);
    } catch (err) {
      setError('Error processing test results. Please try again.');
      console.error('Test completion error:', err);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>YouYoung</h1>
        <p>Connect with a version of yourself from your younger years</p>
      </header>
      
      <main>
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {!isVerified && (
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
                  className="verification-button"
                >
                  Verify with World ID
                </button>
              )}
            </IDKitWidget>
          </div>
        )}
        
        {isVerified && !testCompleted && (
          <PsychologicalTest onTestComplete={handleTestComplete} />
        )}
        
        {isVerified && testCompleted && personaConfig && (
          <ChatInterface personaConfig={personaConfig} />
        )}
      </main>
      
      <footer>
        <p>Powered by World ID</p>
      </footer>
      
      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        
        header {
          text-align: center;
          margin-bottom: 30px;
        }
        
        h1 {
          color: #784be8;
          margin-bottom: 10px;
        }
        
        main {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        
        .error-message {
          background-color: #ffebee;
          color: #c62828;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          text-align: center;
        }
        
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
        
        footer {
          text-align: center;
          margin-top: 40px;
          color: #666;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default Home;
