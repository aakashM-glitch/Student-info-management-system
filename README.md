# Student Information System

A complete MERN stack Student Information System for colleges with role-based access control.

## Features

- Role-based authentication (Admin/Student)
- Student management (CRUD operations)
- Profile photo upload
- Student attendance tracking
- Academic performance monitoring
- Responsive UI with Tailwind CSS
- Protected routes
- JWT authentication

## Tech Stack

- MongoDB
- Express.js
- React + Vite
- Node.js
- Tailwind CSS
- JWT Authentication

## Requirements

- Node.js 14+
- MongoDB
- NPM or Yarn

## Installation

1. Clone the repository
2. Install dependencies for backend and frontend

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Configure environment variables

Create `.env` file in backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/college-sis
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
```

4. Seed the admin user

```bash
# The default admin credentials are:
Email: admin@college.com
Password: Admin@123
```

5. Start the application

```bash
# Start backend server (from backend directory)
npm run dev

# Start frontend development server (from frontend directory)
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- POST /api/auth/login - Login user
- POST /api/auth/register - Register new user
- GET /api/auth/me - Get current user

### Students
- GET /api/students - Get all students (Admin only)
- GET /api/students/:id - Get single student
- POST /api/students - Create new student (Admin only)
- PUT /api/students/:id - Update student (Admin only)
- DELETE /api/students/:id - Delete student (Admin only)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT

## Author

Your Name