# Inspiration Saloon

A full-stack salon booking and management application with customer loyalty system.

## Project Structure

- **inspiration-saloon/** - Main customer-facing website (React + Vite)
- **admin-portal/** - Admin dashboard for managing appointments, services, and customers (React + Vite)
- **server/** - Backend API server (Node.js + Express + MongoDB)

## Features

- Online appointment booking
- Service catalog with AI-powered recommendations
- Customer loyalty program (Normal, Local, Advanced, Premium tiers)
- Admin panel for managing appointments, services, gallery, and receipts
- Email notifications
- Receipt generation system
- Video gallery and marketing content

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd copy_saloon
```

2. Install dependencies for all projects:
```bash
# Server
cd server
npm install

# Customer website
cd ../inspiration-saloon
npm install

# Admin portal
cd ../admin-portal
npm install
```

3. Configure environment variables:

Create a `.env` file in the `server/` directory:
```env
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/inspiration_saloon
ADMIN_USER=admin
ADMIN_PASS=password123
JWT_SECRET=your_secret_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Running the Application

1. Start MongoDB (if running locally)

2. Start the backend server:
```bash
cd server
npm start
```

3. Start the customer website:
```bash
cd inspiration-saloon
npm run dev
```

4. Start the admin portal:
```bash
cd admin-portal
npm run dev
```

The applications will be available at:
- Customer website: http://localhost:5173
- Admin portal: http://localhost:5174
- Backend API: http://localhost:4000

## Default Admin Credentials

- Username: `admin`
- Password: `password123`

**⚠️ Change these credentials in production!**

## Technologies Used

- **Frontend**: React, Vite, TailwindCSS
- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Email**: Nodemailer

## License

ISC
