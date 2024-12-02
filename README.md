GAME Catch falling elements

Need to personallyse the game with the images

## Technologies

- **Next.js**: For building serverless functions and handling API routes.
- **Prisma**: As the database ORM for seamless interactions with MongoDB.
- **MongoDB**: For data storage.

## Installation

### Prerequisites

1. Node.js (v16 or later)
2. MongoDB instance (local or cloud-based)
3. Prisma CLI

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/leaderboard-api.git
   cd leaderboard-api
   
2- Install dependances 

npm install

3 - Configure your database connection:

    Update the .env file with your MongoDB connection string:

DATABASE_URL="mongodb://username:password@localhost:27017/leaderboard"


4 - Generate Prisma Client:

npx prisma generate
npx prisma db push

5- npm run dev
