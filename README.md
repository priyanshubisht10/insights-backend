# Insights-backend

This repo contains the backend component of a platform designed to assist content creators in managing their YouTube accounts more effectively. The backend enables users to connect their YouTube accounts, analyze video comments, and interact with their audience directly.

## Features
1. **User Accounts:**
   - Users can create accounts and log in securely.
   - After signing up, users can link their YouTube accounts using their Channel ID.

2. **Video Management:**
   - The platform fetches all videos from the connected YouTube account.
   - Users can view a list of their uploaded videos.

3. **Comment Analysis:**
   - Users can select any video and initiate a scan of its comments.
   - The platform uses ***OpenAI SDK*** to filter comments, identifying questions or doubts that are suitable for user responses.
   - Filtered comments are displayed for user review.
   - Users can directly reply to comments from the platform.

4. **Payment Integration:**
   - The cost of scanning comments is calculated based on the number of comments filtered.
   - The platform integrates ***Stripe’s payment gateway*** for handling transactions in a pay-as-you-go model.
   - ***Stripe Webhooks*** are implemented for tracking and managing payments efficiently.

## Technologies Used
1. **APIs and SDKs:**
   - [YouTube Data API v3](https://developers.google.com/youtube/v3): For fetching videos and comments from YouTube.
   - [OpenAI SDK](https://platform.openai.com/docs/): For analyzing and filtering comments. Used `GPT-3.5 Turbo` for this.

2. **Backend:**
   - Node.js with Express.js: For server-side logic and API endpoints.

3. **Database:**
   - MongoDB: For managing user data, videos, payments and scanned comment records.

4. **Payment:**
   - Stripe API: For processing payments and webhooks.

## How It Works
1. **Sign-Up and Account Linking:**
   - Users sign up on the platform and link their YouTube accounts by providing their Channel ID.
   
2. **Video and Comment Management:**
   - The platform fetches all uploaded videos from the linked account.
   - Users select a video and initiate a scan to analyze its comments.

3. **Comment Filtering:**
   - Comments are processed using OpenAI’s SDK to identify actionable queries or doubts.
   - Filtered comments are displayed for user review and response.

4. **Payments:**
   - After a scan, the platform calculates the cost based on the number of comments processed.
   - Users can complete payments securely via Stripe.

## Installation
1. Clone the repository:
   ```bash
   https://github.com/priyanshubisht10/insights-backend.git
   ```

2. Install dependencies:
   ```bash
   cd insights-backend
   npm install
   ```

3. Set up environment variables: Create a `config.env` file in the root directory.
    ```env
    NODE_ENV=development
    PORT=8000
    DATABASE=
    DATABASE_PASSWORD=
    JWT_SECRET=
    JWT_EXPIRES_IN=90d
    JWT_COOKIE_EXPIRES_IN=90
    YT_API_SECRET=
    YT_API_URL_GETALL=
    YT_API_URL_REPLY=
    CLIENT_ID=
    CLIENT_SECRET=
    OPENAI_ORG=
    OPENAI_API_SECRET=
    STRIPE_PRIVATE_KEY=
    STRIPE_SIGNING_SECRET=
    ```

4. Start the server:
   ```bash
   nodemon server.js
   ```

For any questions or suggestions, feel free to reach out to me. I'll add the article for the implementation of Webhooks and a complete documentation of this project on Medium soon. Stay tuned! (https://priyanshubisht10.medium.com/)

