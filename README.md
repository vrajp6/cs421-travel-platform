# cs421-travel-platform

TravelTopia

TravelTopia is a travel planning platform that allows users to create, manage, and share their travel plans. This README provides information on how to set up the project, its features, and how to contribute.

Features
User authentication (login, register)
Create and manage travel plans
User profile management
Responsive and modern UI
Getting Started
Prerequisites
Make sure you have the following installed:

Node.js
npm
PostgreSQL

Installation
Clone the repository:


git clone https://github.com/your_github_username/cs421-travel-platform.git
cd cs421-travel-platform
Install server dependencies:


cd server
npm install
Install client dependencies:

cd ../client
npm install


Database Setup

Set up PostgreSQL:

Create a new PostgreSQL database.
Set up environment variables:

Create a .env file in the server directory with the following content:

PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/your-database-name
JWT_SECRET=your-jwt-secret
Run database migrations:

cd server
npx sequelize-cli db:migrate
Starting the Application
Start the development server:

cd server
npm run dev
Start the client:

cd ../client
npm start


Usage

Access the application:

Navigate to http://localhost:3000 to access the application.

User Authentication:

Register: Create a new user account.
Login: Use existing credentials to log in.
User Profile:

After logging in, navigate to your profile to create and manage your travel plans.

Contributing
We welcome contributions! Follow these steps to contribute:

Fork the repository:

Click the "Fork" button at the top right of the repository page.

Create a new branch:

git checkout -b feature/your-feature-name
Make your changes and commit them:

git commit -m 'Add some feature'
Push to the branch:

git push origin feature/your-feature-name
Create a new Pull Request:

Go to the repository on GitHub and click the "New Pull Request" button.
