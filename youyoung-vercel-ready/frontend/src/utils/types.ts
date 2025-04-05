import { VerificationLevel } from '@worldcoin/minikit-js';

export type VerifyCommandInput = {
  action: string;
  signal?: string;
  verification_level?: VerificationLevel;
};

export type MiniAppVerifyActionSuccessPayload = {
  status: 'success';
  proof: string;
  merkle_root: string;
  nullifier_hash: string;
  verification_level: VerificationLevel;
  version: number;
};

export interface ISuccessResult {
  payload: any;
  action: string;
  signal?: string;
}

export interface IVerifyResponse {
  success: boolean;
  message?: string;
  data?: any;
}

// Psychological test types
export interface TestQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'text' | 'scale';
  options?: string[];
  min?: number;
  max?: number;
}

export interface TestResult {
  questionId: string;
  answer: string | number;
}

export interface PersonalityProfile {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
  memories: string[];
  aspirations: string[];
  fears: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: number;
}
