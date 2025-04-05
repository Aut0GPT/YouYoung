# YouYoung - Chat with Your Younger Self

This application allows users to interact with an AI version of their younger selves after verification through World ID. The app includes psychological tests to create a personalized AI persona based on the user's personality traits, memories, aspirations, and fears.

## Deployment Instructions

### Frontend Deployment to Vercel

1. Create a Vercel account if you don't have one already at [vercel.com](https://vercel.com)

2. Install the Vercel CLI:
   ```
   npm install -g vercel
   ```

3. Navigate to the frontend directory:
   ```
   cd frontend
   ```

4. Login to Vercel:
   ```
   vercel login
   ```

5. Deploy to Vercel:
   ```
   vercel
   ```

6. For production deployment:
   ```
   vercel --prod
   ```

7. Set up the following environment variables in the Vercel project settings:
   - `NEXT_PUBLIC_APP_ID`: app_b636a7e558dec2f33f8a449094f7b35e
   - `NEXT_PUBLIC_ACTION`: youyoung-member
   - `MONGODB_URI`: Your MongoDB connection string

### Backend Deployment (Optional)

The application is designed to work with the frontend API routes for most functionality. However, if you need to deploy the backend separately:

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Build the TypeScript code:
   ```
   npm run build
   ```

3. Deploy to Vercel:
   ```
   vercel
   ```

4. Set up the following environment variables in the Vercel project settings:
   - `MONGODB_URI`: Your MongoDB connection string
   - `WORLD_APP_ID`: app_b636a7e558dec2f33f8a449094f7b35e
   - `WORLD_CLIENT_SECRET`: sk_5c2b08bfa2fe294f850ce132d694c030e4c2dfd23361df51
   - `FRONTEND_URL`: URL of your deployed frontend

## MongoDB Setup

1. Create a MongoDB Atlas account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user with read/write permissions
4. Get your connection string and add it to your environment variables

## World ID Integration

The application uses World ID for identity verification. The following credentials are already configured:

- App ID: app_b636a7e558dec2f33f8a449094f7b35e
- Action ID: youyoung-member
- Client Secret: sk_5c2b08bfa2fe294f850ce132d694c030e4c2dfd23361df51

## Local Development

1. Install dependencies:
   ```
   cd frontend
   npm install
   ```

2. Run the development server:
   ```
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `frontend/`: Next.js application with API routes
  - `src/pages/`: Application pages and API routes
  - `src/components/`: React components
  - `src/utils/`: Utility functions and types

- `backend/`: Express server (optional)
  - `src/controllers/`: API controllers
  - `src/models/`: Database models
  - `src/routes/`: API routes
  - `src/middleware/`: Express middleware
  - `src/utils/`: Utility functions

## Technologies Used

- Next.js
- React
- TypeScript
- World ID (IDKit)
- MongoDB
- Vercel for deployment
