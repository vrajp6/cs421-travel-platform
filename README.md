# TravelTopia

## Description:
TravelTopia is a travel platform that allows users to share their travel experiences, plan new trips, and connect with other travel enthusiasts. Users can create profiles, update their travel history and upcoming plans, and engage with posts from other users.

### Features
-User registration and authentication<br>
-Profile management with profile picture upload<br>
-Travel history and upcoming travel plans management<br>
-Post creation and feed for user posts<br>
-Search functionality to find other users by username or travel history<br>

Getting Started:<br>
Before you begin, ensure you have met the following requirements:

-Node.js and npm installed on your machine<br>
-PostgreSQL database installed and running<br>
-Git installed on your machine<br>

**Installation**

1. Clone the Repository:<br>

git clone https://github.com/your-username/cs421-travel-platform.git<br>
cd cs421-travel-platform<br>

2. Install Backend Dependencies<br>
Navigate to the backend directory and install the required dependencies:<br>

cd server<br>
npm install<br>

3. Install Frontend Dependencies<br>
Navigate to the frontend directory and install the required dependencies:<br>

cd client<br>
npm install<br>

4. Set Up Environment Variables

Create a .env file in the backend directory with the following content:<br>

JWT_SECRET=mySuperSecretKey<br>
DATABASE_URL=postgres://postgres:<your_postgres_passsword>@localhost:5000/travel_platform_dev<br>

5. Fix files in the config folder of the backend to include the correct database password, which is the one you set during PostgreSQL installation<br>

config.json:<br>
{<br>
    "development": {<br>
      "username": "postgres",<br>
      "password": "<your_password>",<br>
      "database": "travel_platform_dev",<br>
      "host": "127.0.0.1",<br>
      "dialect": "postgres"<br>
    }<br>
  }

database.js:<br>
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('travel_platform_dev', 'postgres', '<your_password>', {
  host: 'localhost',
  dialect: 'postgres', // or 'mysql' or any other supported dialect
  logging: false,
});

module.exports = sequelize;

6. Run Database Migrations

Create a new database in PGAdmin called travel_platform_dev, ensure your PostgreSQL database is running, and then run the migrations to set up the database schema:<br>

cd server<br>
npx sequelize-cli db:migrate<br>

7. Running the Application

Start the Backend Server

cd server<br>
node server.js<br>

Start the Frontend Server

Open a new terminal window and navigate to the frontend directory:

cd client
npm start

The frontend development server will start, and you can access the application at http://localhost:3000.
