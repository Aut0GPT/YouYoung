# Younger Self Chat - Mini App for World App

This Mini App allows users to interact with an AI version of their younger selves after verification through World ID. The app includes psychological tests to create a personalized AI persona based on the user's personality traits, memories, aspirations, and fears.

## Table of Contents

1. [Features](#features)
2. [Architecture](#architecture)
3. [Setup Instructions](#setup-instructions)
4. [API Documentation](#api-documentation)
5. [Usage Guide](#usage-guide)
6. [Development](#development)

## Features

- **World ID Verification**: Secure identity verification using World ID
- **Psychological Tests**: Personality assessment based on the "Big Five" traits
- **Memory & Aspiration Collection**: Gathering of childhood memories and aspirations
- **AI Persona Generation**: Creation of a personalized AI persona based on test results
- **Interactive Chat Interface**: Conversation with the AI "younger self"

## Architecture

The application is divided into two main components:

### Frontend

- Built with Next.js and React
- Uses MiniKit v1.7 for World App integration
- Implements responsive UI components for all app features
- Handles client-side validation and state management

### Backend

- Node.js server with Express
- MongoDB database for user data and chat history storage
- RESTful API endpoints for all app functionality
- Authentication middleware for secure access

## Setup Instructions

### Prerequisites

- Node.js v16+ and npm
- MongoDB (local or cloud instance)
- World App Developer account with an action ID for World ID verification

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd world-app-mini-app/backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/younger-self-chat
   WORLD_APP_ID=your_world_app_id_here
   ```

4. Build the TypeScript code:
   ```
   npm run build
   ```

5. Start the server:
   ```
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd world-app-mini-app/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file with the following variables:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_WORLD_ACTION_ID=your_world_action_id_here
   ```

4. Build the application:
   ```
   npm run build
   ```

5. Start the development server:
   ```
   npm run dev
   ```

## API Documentation

### Authentication

All protected endpoints require World ID verification. The nullifier hash from the verification is used as the user identifier.

### Endpoints

#### World ID Verification

- **POST /api/verify**
  - Verifies a World ID proof
  - Request body: `{ payload: { proof, merkle_root, nullifier_hash, verification_level }, action, signal }`
  - Response: `{ success: true, message: "Verification successful", data: { verified: true, nullifier_hash } }`

#### Psychological Tests

- **POST /api/test-results**
  - Stores psychological test results
  - Request body: `{ nullifierHash, testResults: { openness, conscientiousness, extraversion, agreeableness, neuroticism, memories, aspirations, fears } }`
  - Response: `{ success: true, message: "Test results stored successfully", data: { nullifierHash, personalityProfile } }`

- **GET /api/profile/:nullifierHash**
  - Retrieves a user's personality profile
  - Response: `{ success: true, data: { nullifierHash, personalityProfile } }`

#### Chat

- **POST /api/chat**
  - Sends a message and gets an AI response
  - Request body: `{ nullifierHash, message }`
  - Response: `{ success: true, data: { userMessage, aiMessage } }`

- **GET /api/chat/:nullifierHash**
  - Retrieves chat history
  - Query parameters: `limit` (default: 50), `before` (timestamp)
  - Response: `{ success: true, data: { messages, hasMore } }`

## Usage Guide

### User Flow

1. **World ID Verification**:
   - Open the Mini App in World App
   - Click "Verify with World ID" button
   - Complete the verification process in World App

2. **Psychological Tests**:
   - After verification, complete the personality test
   - Answer questions about childhood memories
   - Share aspirations and fears from your younger years

3. **Chat Interface**:
   - Interact with your AI "younger self"
   - The AI persona will respond based on your test results
   - Continue the conversation to explore your younger perspective

### Tips for Best Experience

- Be honest in the psychological tests for a more accurate persona
- Provide detailed memories for more personalized conversations
- Ask your "younger self" about their hopes, dreams, and fears

## Development

### Testing

Run backend tests:
```
cd world-app-mini-app/backend
npm test
```

### Extending the App

- Add more psychological tests in `PsychologicalTest.tsx`
- Enhance AI persona generation in `aiPersona.ts`
- Improve chat functionality in `chatController.ts`

### Deployment

The Mini App can be deployed to the World App store after testing. Follow the World App developer documentation for submission guidelines.
