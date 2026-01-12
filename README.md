# Todo Web App - Full Stack Application

A production-ready, full-stack task management application built with React.js, Node.js, Express, MongoDB, and Firebase Authentication. Users can create multiple boards, manage todos within boards, and perform full CRUD operations on both boards and todos.

## 🚀 Project Overview

This application provides a complete task management solution with:

- **User Authentication**: Secure email-based authentication using Firebase with email verification
- **Board Management**: Create, read, update, and delete boards
- **Todo Management**: Full CRUD operations on todos within boards
- **User-Friendly UI**: Clean, modern interface with intuitive UX
- **Protected Routes**: Secure access to authenticated pages only

## 🛠 Tech Stack

### Frontend
- **React.js** (v18.2.0) - Modern React with hooks and functional components
- **React Router DOM** (v6.20.1) - Client-side routing
- **Firebase** (v10.7.1) - Authentication and email verification
- **Axios** (v1.6.2) - HTTP client for API requests

### Backend
- **Node.js** - Runtime environment
- **Express.js** (v4.18.2) - Web framework
- **MongoDB** with **Mongoose** (v8.0.3) - Database and ODM
- **Firebase Admin SDK** (v12.0.0) - Server-side Firebase authentication
- **JSON Web Token (JWT)** (v9.0.2) - Session management
- **Express Validator** (v7.0.1) - Input validation
- **CORS** (v2.8.5) - Cross-origin resource sharing

## 📁 Project Structure

```
Humanli/
├── backend/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   └── firebase.js          # Firebase Admin SDK setup
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── boardController.js   # Board CRUD operations
│   │   └── todoController.js    # Todo CRUD operations
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication middleware
│   │   ├── errorHandler.js      # Global error handling
│   │   └── validator.js         # Input validation rules
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Board.js             # Board schema
│   │   └── Todo.js              # Todo schema
│   ├── routes/
│   │   ├── authRoutes.js        # Authentication routes
│   │   ├── boardRoutes.js       # Board routes
│   │   └── todoRoutes.js        # Todo routes
│   ├── .env.example             # Environment variables template
│   ├── .gitignore
│   ├── package.json
│   └── server.js                # Express server entry point
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── ProtectedRoute.js    # Route protection component
│   │   ├── config/
│   │   │   └── firebase.js           # Firebase client config
│   │   ├── context/
│   │   │   └── AuthContext.js        # Authentication context
│   │   ├── pages/
│   │   │   ├── Login.js              # Login page
│   │   │   ├── Signup.js             # Signup page
│   │   │   ├── Dashboard.js          # Dashboard with board list
│   │   │   └── BoardDetail.js        # Board detail with todos
│   │   ├── services/
│   │   │   └── api.js                # API service layer
│   │   ├── App.js                    # Main app component
│   │   ├── index.js                  # React entry point
│   │   └── index.css                 # Global styles
│   ├── .env.example                  # Environment variables template
│   ├── .gitignore
│   └── package.json
│
└── README.md
```

## 🔧 Setup Instructions

### Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **Firebase Project** with Authentication enabled
- **npm** or **yarn** package manager

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Fill in all required environment variables (see Environment Variables section)

4. **Set up Firebase Admin SDK:**
   - Go to Firebase Console → Project Settings → Service Accounts
   - Generate a new private key
   - Copy the service account credentials to your `.env` file

5. **Start MongoDB:**
   - If using local MongoDB, ensure it's running on `mongodb://localhost:27017`
   - Or update `MONGODB_URI` in `.env` with your MongoDB Atlas connection string

6. **Start the server:**
   ```bash
   # Development mode (with nodemon)
   npm run dev

   # Production mode
   npm start
   ```

   The server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Fill in your Firebase configuration (see Environment Variables section)

4. **Start the development server:**
   ```bash
   npm start
   ```

   The app will open in your browser at `http://localhost:3000`

## 🔐 Environment Variables

### Backend (.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/todoapp

# Firebase Admin SDK Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40your-project.iam.gserviceaccount.com

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)

```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id

REACT_APP_API_URL=http://localhost:5000/api/v1
```

## 🔑 Authentication Flow

### How Authentication Works

1. **User Registration/Login:**
   - User signs up or logs in using Firebase Authentication on the frontend
   - Firebase handles email verification (verification email is sent automatically on signup)

2. **Token Exchange:**
   - After successful Firebase authentication, frontend receives a Firebase ID token
   - Frontend sends this token to backend endpoint `/api/v1/auth/register`
   - Backend verifies the Firebase token using Firebase Admin SDK

3. **User Creation/Sync:**
   - Backend checks if user exists in MongoDB (by Firebase UID)
   - If not exists, creates new user record
   - If exists, updates user information (email verification status, name, etc.)

4. **JWT Token Generation:**
   - Backend generates a JWT token for session management
   - JWT token is returned to frontend and stored in localStorage
   - JWT token is used for subsequent API requests

5. **Protected Routes:**
   - Frontend uses `ProtectedRoute` component to guard authenticated pages
   - Backend uses `authenticate` middleware to verify Firebase token on each request
   - Invalid or expired tokens result in 401 Unauthorized response

### Email Verification

- Users must verify their email before logging in
- Verification email is sent automatically on signup
- Users can request a new verification email from the login page if needed
- Backend tracks email verification status in the user model

## 📡 API Endpoints

All API endpoints are prefixed with `/api/v1`

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register/Login with Firebase token | No |
| GET | `/auth/me` | Get current authenticated user | Yes |

### Board Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/boards` | Get all boards for authenticated user | Yes |
| GET | `/boards/:id` | Get a single board by ID | Yes |
| POST | `/boards` | Create a new board | Yes |
| PUT | `/boards/:id` | Update a board | Yes |
| DELETE | `/boards/:id` | Delete a board and all its todos | Yes |

### Todo Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/todos/boards/:boardId/todos` | Get all todos for a board | Yes |
| GET | `/todos/:id` | Get a single todo by ID | Yes |
| POST | `/todos/boards/:boardId/todos` | Create a new todo in a board | Yes |
| PUT | `/todos/:id` | Update a todo | Yes |
| DELETE | `/todos/:id` | Delete a todo | Yes |

### Request/Response Format

**Request Headers:**
```
Authorization: Bearer <firebase-id-token>
Content-Type: application/json
```

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ]  // For validation errors
}
```

### Example API Calls

**Create Board:**
```bash
POST /api/v1/boards
Headers: Authorization: Bearer <token>
Body: {
  "title": "My Board",
  "description": "Board description",
  "color": "#3b82f6"
}
```

**Create Todo:**
```bash
POST /api/v1/todos/boards/:boardId/todos
Headers: Authorization: Bearer <token>
Body: {
  "title": "My Todo",
  "description": "Todo description",
  "priority": "high",
  "completed": false
}
```

## 🗄 Database Schema

### User Model
```javascript
{
  firebaseUID: String (unique, indexed),
  email: String (unique, lowercase),
  emailVerified: Boolean,
  name: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Board Model
```javascript
{
  title: String (required, max 100 chars),
  description: String (max 500 chars),
  userId: ObjectId (ref: User, indexed),
  color: String (hex color, default: #3b82f6),
  createdAt: Date,
  updatedAt: Date
}
```

### Todo Model
```javascript
{
  title: String (required, max 200 chars),
  description: String (max 1000 chars),
  completed: Boolean (default: false),
  boardId: ObjectId (ref: Board, indexed),
  userId: ObjectId (ref: User, indexed),
  priority: String (enum: ['low', 'medium', 'high'], default: 'medium'),
  dueDate: Date (optional),
  createdAt: Date,
  updatedAt: Date
}
```

## 🎨 Features

### User Features
- ✅ Email-based registration and login
- ✅ Email verification requirement
- ✅ Secure session management with JWT
- ✅ User profile management

### Board Features
- ✅ Create multiple boards
- ✅ Edit board title and description
- ✅ Custom board colors
- ✅ Delete boards (cascades to todos)
- ✅ View all boards in dashboard

### Todo Features
- ✅ Create todos within boards
- ✅ Mark todos as complete/incomplete
- ✅ Set todo priority (low, medium, high)
- ✅ Add descriptions to todos
- ✅ Delete todos
- ✅ Visual priority indicators
- ✅ Completion tracking

## 🛡 Security Features

- Firebase Authentication for secure user authentication
- JWT tokens for session management
- Protected API routes with authentication middleware
- Input validation using express-validator
- CORS configuration for secure cross-origin requests
- Environment variables for sensitive configuration
- Email verification requirement

## 🚦 Error Handling

- Centralized error handling middleware
- Meaningful error messages
- Proper HTTP status codes
- Validation error details
- Development vs production error responses

## 📝 Development Notes

### Code Quality
- Clean, readable, and well-commented code
- MVC architecture pattern
- Separation of concerns
- Reusable components
- Consistent naming conventions

### Best Practices
- RESTful API design
- Proper HTTP status codes
- Input validation
- Error handling
- Environment variable usage
- Secure authentication flow

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error:**
   - Ensure MongoDB is running
   - Check `MONGODB_URI` in `.env`
   - Verify network connectivity

2. **Firebase Authentication Error:**
   - Verify Firebase configuration in `.env`
   - Check Firebase project settings
   - Ensure email authentication is enabled in Firebase Console

3. **CORS Errors:**
   - Verify `FRONTEND_URL` in backend `.env`
   - Check that frontend URL matches your React app URL

4. **JWT Token Errors:**
   - Ensure `JWT_SECRET` is set in backend `.env`
   - Check token expiration settings

## 📄 License

This project is open source and available for use.

## 👨‍💻 Author

Built as a production-ready full-stack application following best practices and modern development standards.

---

**Happy Coding! 🚀**
