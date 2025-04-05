import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { Request, Response, NextFunction } from 'express';
import { validateWorldIDRequest, validateTestResultsRequest, validateChatMessageRequest } from '../middleware/validation';

describe('Validation Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;
  let responseObject: any = {};

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup mock response
    responseObject = {
      statusCode: 0,
      jsonData: {}
    };
    
    mockResponse = {
      status: jest.fn().mockImplementation((code) => {
        responseObject.statusCode = code;
        return mockResponse;
      }),
      json: jest.fn().mockImplementation((data) => {
        responseObject.jsonData = data;
        return mockResponse;
      })
    };
    
    nextFunction = jest.fn();
  });

  describe('validateWorldIDRequest', () => {
    it('should call next() if request is valid', () => {
      mockRequest = {
        body: {
          payload: {
            proof: 'mock-proof',
            merkle_root: 'mock-merkle-root',
            nullifier_hash: 'mock-nullifier-hash',
            verification_level: 'orb'
          },
          action: 'mock-action'
        }
      };
      
      validateWorldIDRequest(mockRequest as Request, mockResponse as Response, nextFunction);
      
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should return 400 if payload is missing', () => {
      mockRequest = {
        body: {
          action: 'mock-action'
        }
      };
      
      validateWorldIDRequest(mockRequest as Request, mockResponse as Response, nextFunction);
      
      expect(nextFunction).not.toHaveBeenCalled();
      expect(responseObject.statusCode).toBe(400);
      expect(responseObject.jsonData.success).toBe(false);
    });

    it('should return 400 if action is missing', () => {
      mockRequest = {
        body: {
          payload: {
            proof: 'mock-proof',
            merkle_root: 'mock-merkle-root',
            nullifier_hash: 'mock-nullifier-hash',
            verification_level: 'orb'
          }
        }
      };
      
      validateWorldIDRequest(mockRequest as Request, mockResponse as Response, nextFunction);
      
      expect(nextFunction).not.toHaveBeenCalled();
      expect(responseObject.statusCode).toBe(400);
      expect(responseObject.jsonData.success).toBe(false);
    });

    it('should return 400 if payload is incomplete', () => {
      mockRequest = {
        body: {
          payload: {
            proof: 'mock-proof',
            // Missing merkle_root
            nullifier_hash: 'mock-nullifier-hash',
            verification_level: 'orb'
          },
          action: 'mock-action'
        }
      };
      
      validateWorldIDRequest(mockRequest as Request, mockResponse as Response, nextFunction);
      
      expect(nextFunction).not.toHaveBeenCalled();
      expect(responseObject.statusCode).toBe(400);
      expect(responseObject.jsonData.success).toBe(false);
    });
  });

  describe('validateTestResultsRequest', () => {
    it('should call next() if request is valid', () => {
      mockRequest = {
        body: {
          nullifierHash: 'mock-nullifier-hash',
          testResults: {
            openness: 3,
            conscientiousness: 4,
            extraversion: 2,
            agreeableness: 5,
            neuroticism: 1,
            memories: ['memory1', 'memory2'],
            aspirations: ['aspiration1'],
            fears: ['fear1', 'fear2']
          }
        }
      };
      
      validateTestResultsRequest(mockRequest as Request, mockResponse as Response, nextFunction);
      
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should return 400 if nullifierHash is missing', () => {
      mockRequest = {
        body: {
          testResults: {
            openness: 3,
            conscientiousness: 4,
            extraversion: 2,
            agreeableness: 5,
            neuroticism: 1,
            memories: ['memory1', 'memory2'],
            aspirations: ['aspiration1'],
            fears: ['fear1', 'fear2']
          }
        }
      };
      
      validateTestResultsRequest(mockRequest as Request, mockResponse as Response, nextFunction);
      
      expect(nextFunction).not.toHaveBeenCalled();
      expect(responseObject.statusCode).toBe(400);
      expect(responseObject.jsonData.success).toBe(false);
    });

    it('should return 400 if personality trait is invalid', () => {
      mockRequest = {
        body: {
          nullifierHash: 'mock-nullifier-hash',
          testResults: {
            openness: 6, // Invalid: should be 1-5
            conscientiousness: 4,
            extraversion: 2,
            agreeableness: 5,
            neuroticism: 1,
            memories: ['memory1', 'memory2'],
            aspirations: ['aspiration1'],
            fears: ['fear1', 'fear2']
          }
        }
      };
      
      validateTestResultsRequest(mockRequest as Request, mockResponse as Response, nextFunction);
      
      expect(nextFunction).not.toHaveBeenCalled();
      expect(responseObject.statusCode).toBe(400);
      expect(responseObject.jsonData.success).toBe(false);
    });
  });

  describe('validateChatMessageRequest', () => {
    it('should call next() if request is valid', () => {
      mockRequest = {
        body: {
          nullifierHash: 'mock-nullifier-hash',
          message: 'Hello, this is a test message'
        }
      };
      
      validateChatMessageRequest(mockRequest as Request, mockResponse as Response, nextFunction);
      
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should return 400 if nullifierHash is missing', () => {
      mockRequest = {
        body: {
          message: 'Hello, this is a test message'
        }
      };
      
      validateChatMessageRequest(mockRequest as Request, mockResponse as Response, nextFunction);
      
      expect(nextFunction).not.toHaveBeenCalled();
      expect(responseObject.statusCode).toBe(400);
      expect(responseObject.jsonData.success).toBe(false);
    });

    it('should return 400 if message is empty', () => {
      mockRequest = {
        body: {
          nullifierHash: 'mock-nullifier-hash',
          message: ''
        }
      };
      
      validateChatMessageRequest(mockRequest as Request, mockResponse as Response, nextFunction);
      
      expect(nextFunction).not.toHaveBeenCalled();
      expect(responseObject.statusCode).toBe(400);
      expect(responseObject.jsonData.success).toBe(false);
    });
  });
});
