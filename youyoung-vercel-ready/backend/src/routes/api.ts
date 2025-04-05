import express from 'express';
import { verifyWorldID } from '../controllers/worldIdController';
import { storeTestResults, getPersonalityProfile } from '../controllers/testController';
import { sendMessage, getChatHistory } from '../controllers/chatController';
import { validateWorldIDRequest, validateTestResultsRequest, validateChatMessageRequest } from '../middleware/validation';
import { verifyUserAuthentication } from '../middleware/auth';

const router = express.Router();

// World ID verification route
router.post('/verify', validateWorldIDRequest, verifyWorldID);

// Test results routes - require authentication
router.post('/test-results', validateTestResultsRequest, verifyUserAuthentication, storeTestResults);
router.get('/profile/:nullifierHash', verifyUserAuthentication, getPersonalityProfile);

// Chat routes - require authentication
router.post('/chat', validateChatMessageRequest, verifyUserAuthentication, sendMessage);
router.get('/chat/:nullifierHash', verifyUserAuthentication, getChatHistory);

export default router;
