import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { Request, Response } from 'express';
import { verifyWorldID } from '../controllers/worldIdController';
import { verifyCloudProof } from '@worldcoin/minikit-js';

// Mock the verifyCloudProof function
jest.mock('@worldcoin/minikit-js', () => ({
  verifyCloudProof: jest.fn()
}));

describe('World ID Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any = {};

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup mock request and response
    mockRequest = {
      body: {
        payload: {
          proof: 'mock-proof',
          merkle_root: 'mock-merkle-root',
          nullifier_hash: 'mock-nullifier-hash',
          verification_level: 'orb',
          version: 1
        },
        action: 'mock-action',
        signal: 'mock-signal'
      }
    };
    
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
  });

  it('should return 400 if payload is missing', async () => {
    mockRequest.body = { action: 'mock-action' };
    
    await verifyWorldID(mockRequest as Request, mockResponse as Response);
    
    expect(responseObject.statusCode).toBe(400);
    expect(responseObject.jsonData.success).toBe(false);
    expect(responseObject.jsonData.message).toContain('Missing required parameters');
  });

  it('should return 400 if action is missing', async () => {
    mockRequest.body = { 
      payload: {
        proof: 'mock-proof',
        merkle_root: 'mock-merkle-root',
        nullifier_hash: 'mock-nullifier-hash',
        verification_level: 'orb',
        version: 1
      }
    };
    
    await verifyWorldID(mockRequest as Request, mockResponse as Response);
    
    expect(responseObject.statusCode).toBe(400);
    expect(responseObject.jsonData.success).toBe(false);
    expect(responseObject.jsonData.message).toContain('Missing required parameters');
  });

  it('should return 200 if verification is successful', async () => {
    // Mock successful verification
    (verifyCloudProof as jest.Mock).mockResolvedValue({ success: true });
    
    await verifyWorldID(mockRequest as Request, mockResponse as Response);
    
    expect(verifyCloudProof).toHaveBeenCalledWith(
      mockRequest.body.payload,
      expect.any(String),
      mockRequest.body.action,
      mockRequest.body.signal
    );
    
    expect(responseObject.statusCode).toBe(200);
    expect(responseObject.jsonData.success).toBe(true);
    expect(responseObject.jsonData.data.verified).toBe(true);
  });

  it('should return 400 if verification fails', async () => {
    // Mock failed verification
    (verifyCloudProof as jest.Mock).mockResolvedValue({ 
      success: false, 
      error: 'Verification failed'
    });
    
    await verifyWorldID(mockRequest as Request, mockResponse as Response);
    
    expect(responseObject.statusCode).toBe(400);
    expect(responseObject.jsonData.success).toBe(false);
    expect(responseObject.jsonData.message).toContain('Verification failed');
  });

  it('should return 500 if an error occurs during verification', async () => {
    // Mock error during verification
    (verifyCloudProof as jest.Mock).mockRejectedValue(new Error('Test error'));
    
    await verifyWorldID(mockRequest as Request, mockResponse as Response);
    
    expect(responseObject.statusCode).toBe(500);
    expect(responseObject.jsonData.success).toBe(false);
    expect(responseObject.jsonData.message).toContain('Server error');
  });
});
