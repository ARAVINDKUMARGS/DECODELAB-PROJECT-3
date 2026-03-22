# Task Manager API

A production-ready RESTful API for task management built with Node.js, Express.js, and MongoDB.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [API Endpoints](#api-endpoints)
- [Query Parameters](#query-parameters)
- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [Testing with Postman](#testing-with-postman)
- [Additional Resources](#additional-resources)

## ✨ Features

### Core Features
- ✅ **CRUD Operations**: Create, Read, Update, Delete tasks
- ✅ **MongoDB Integration**: Persistent data storage with Mongoose
- ✅ **RESTful API**: Industry-standard REST conventions
- ✅ **Clean Architecture**: MVC pattern for better code organization

### Advanced Features
- 🔍 **Filtering**: Filter tasks by status
- 📊 **Sorting**: Sort by creation date, title, or status
- 🔎 **Search**: Full-text search in task titles
- 📄 **Pagination**: Limit and offset pagination with metadata
- ⏱️ **Timestamps**: Automatic creation and update timestamps
- ✔️ **Validation**: Request body validation with meaningful errors
- 🛡️ **Error Handling**: Centralized error handling middleware
- 📝 **Logging**: Request/response logging with timestamps

## 🛠️ Tech Stack

### Backend
- **Node.js** v14+ - JavaScript runtime
- **Express.js** v4.18+ - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** v7.5+ - MongoDB ODM

### Development
- **Dotenv** - Environment variable management
- **Nodemon** - Development auto-reload
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
task-manager-api/
├── config/
│   └── database.js           # MongoDB connection configuration
├── models/
│   └── Task.js               # Task schema and model definition
├── controllers/
│   └── taskController.js     # Business logic for task operations
├── routes/
│   └── taskRoutes.js         # API route definitions
├── middleware/
│   ├── logger.js             # Request/response logging
│   └── errorHandler.js       # Global error handling
├── server.js                 # Express server setup and initialization
├── package.json              # Project dependencies
├── .env                      # Environment variables (local)
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
├── README.md                 # This file
├── SETUP_GUIDE.md            # Step-by-step setup instructions
└── API_DOCUMENTATION.md      # Detailed API documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (locally installed or MongoDB Atlas cloud account)
- npm or yarn package manager

### Installation Steps

1. **Clone or navigate to project directory**
   ```bash
   cd task-manager-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Update `MONGODB_URI` if needed
   ```bash
   # Linux/Mac
   cp .env.example .env
   
   # Windows
   copy .env.example .env
   ```

4. **Start MongoDB** (if running locally)
   ```bash
   # Linux/Mac
   mongod
   
   # Windows
   mongod
   ```

5. **Start the development server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Verify server is running**
   - Open browser: `http://localhost:5000/health`
   - You should see: `{"status":"OK","message":"Task Manager API is running"}`

## 📡 API Endpoints

### Base URL
```
http://localhost:5000/api/tasks
```

### Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tasks` | Create a new task |
| GET | `/api/tasks` | Get all tasks (with filtering, sorting, pagination) |
| GET | `/api/tasks/stats/summary` | Get task statistics |
| GET | `/api/tasks/:id` | Get a single task by ID |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

## 🔍 Query Parameters

### GET /api/tasks

Available query parameters for filtering and pagination:

```
GET /api/tasks?status=pending&sortBy=createdAt&order=desc&limit=10&page=1&search=buying
```

| Parameter | Type | Default | Description | Example |
|-----------|------|---------|-------------|---------|
| `status` | String | - | Filter by task status | `pending`, `in-progress`, `completed` |
| `sortBy` | String | `createdAt` | Sort field | `createdAt`, `updatedAt`, `title`, `status` |
| `order` | String | `desc` | Sort direction | `asc`, `desc` |
| `limit` | Number | `10` | Results per page (max 100) | `5`, `20`, `50` |
| `page` | Number | `1` | Page number | `1`, `2`, `3` |
| `search` | String | - | Search in title (case-insensitive) | `buy`, `shopping` |

### Examples

**Get pending tasks:**
```
GET /api/tasks?status=pending
```

**Get completed tasks, sorted by title A-Z, 5 per page:**
```
GET /api/tasks?status=completed&sortBy=title&order=asc&limit=5
```

**Search for tasks containing "shopping":**
```
GET /api/tasks?search=shopping
```

**Get page 2 with 20 results:**
```
GET /api/tasks?limit=20&page=2
```

**Combined filters:**
```
GET /api/tasks?status=in-progress&sortBy=createdAt&order=asc&limit=10&page=1&search=urgent
```

## 📤 Response Format

### Success Response (200)
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "status": "pending",
    "createdAt": "2024-03-22T10:30:00.000Z",
    "updatedAt": "2024-03-22T10:30:00.000Z"
  },
  "message": "Task retrieved successfully"
}
```

### List Response with Pagination (200)
```json
{
  "success": true,
  "data": [ /* array of tasks */ ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "message": "Tasks retrieved successfully"
}
```

### Error Response (4xx/5xx)
```json
{
  "success": false,
  "error": "Task title is required"
}
```

## ❌ Error Handling

### Status Codes

| Status | Meaning | Example |
|--------|---------|---------|
| `200` | OK | Request succeeded |
| `201` | Created | Resource created successfully |
| `400` | Bad Request | Invalid input, missing required fields |
| `404` | Not Found | Task ID doesn't exist |
| `409` | Conflict | Duplicate entry |
| `500` | Server Error | Internal server error |

### Common Errors

**1. Missing Required Field**
```json
{
  "success": false,
  "error": "Task title is required"
}
```

**2. Invalid Task ID**
```json
{
  "success": false,
  "error": "Invalid task ID format"
}
```

**3. Task Not Found**
```json
{
  "success": false,
  "error": "Task not found"
}
```

**4. Validation Error**
```json
{
  "success": false,
  "error": "Status must be one of: pending, in-progress, completed"
}
```

## 🧪 Testing with Postman

### Setup Postman Collection

1. **Create New Collection**: "Task Manager API"
2. **Create Environment Variable**:
   - Click "Manage Environments" → "Create New"
   - Add variable: `BASE_URL` = `http://localhost:5000/api/tasks`

3. **Create Requests**

### Request Examples

#### 1. Create a Task
```
POST {{BASE_URL}}
Content-Type: application/json

{
  "title": "Complete project documentation",
  "description": "Write comprehensive docs for the API",
  "status": "pending"
}
```

#### 2. Get All Tasks
```
GET {{BASE_URL}}
```

#### 3. Get Pending Tasks with Pagination
```
GET {{BASE_URL}}?status=pending&limit=5&page=1
```

#### 4. Search Tasks
```
GET {{BASE_URL}}?search=documentation&sortBy=createdAt&order=desc
```

#### 5. Get Statistics
```
GET {{BASE_URL}}/stats/summary
```

#### 6. Update Task Status
```
PUT {{BASE_URL}}/[TASK_ID]
Content-Type: application/json

{
  "status": "completed"
}
```

#### 7. Delete Task
```
DELETE {{BASE_URL}}/[TASK_ID]
```

### Tips for Testing
- Save task ID from create response to use in subsequent requests
- Use Postman's pre-request scripts for automation
- Use a MongoDB GUI tool to verify database changes
- Check server console for detailed logs

## 📚 Additional Resources

### MongoDB Connection

**Local MongoDB:**
```
MONGODB_URI=mongodb://localhost:27017/task-manager
```

**MongoDB Atlas (Cloud):**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/task-manager
```

### Development Commands

```bash
# Install dependencies
npm install

# Start development server (with auto-reload)
npm run dev

# Start production server
npm start

# Install new package
npm install package-name

# Remove package
npm uninstall package-name
```

### Useful Tools
- **MongoDB Compass**: GUI for MongoDB
- **Postman**: API testing and documentation
- **VS Code**: Code editor with REST Client extension
- **Insomnia**: REST client alternative to Postman

### File Descriptions

- **server.js**: Main entry point, Express configuration
- **config/database.js**: MongoDB connection logic
- **models/Task.js**: Data schema and validation
- **controllers/taskController.js**: Business logic
- **routes/taskRoutes.js**: API route definitions
- **middleware/logger.js**: Request logging
- **middleware/errorHandler.js**: Error handling

## 🔐 Security Considerations (Production)

Before deploying to production:

1. ✅ Add authentication (JWT)
2. ✅ Add rate limiting
3. ✅ Add input sanitization
4. ✅ Add request validation
5. ✅ Use HTTPS
6. ✅ Implement CORS whitelist
7. ✅ Add API documentation
8. ✅ Use environment variables for secrets
9. ✅ Add monitoring and logging
10. ✅ Add database backups

## 📞 Support & Troubleshooting

### Issue: Cannot connect to MongoDB

**Solution:**
```bash
# Check if MongoDB is running
# Linux/Mac: lsof -i :27017
# Windows: netstat -ano | findstr :27017

# Verify connection string in .env
# Test with MongoDB Compass
```

### Issue: Port 5000 already in use

**Solution:**
```bash
# Change PORT in .env
PORT=5001

# Or kill process using the port
# Linux/Mac: lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill
# Windows: netstat -ano | findstr :5000
```

### Issue: Dependencies not installing

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

## 📈 Next Steps

- Add authentication middleware
- Add request validation with Joi or Express Validator
- Add unit and integration tests
- Add API rate limiting
- Add caching mechanism
- Deploy to cloud (Heroku, AWS, Azure)
- Add CI/CD pipeline
- Add API versioning

## 📄 License

MIT License - Free to use for personal and commercial projects.

---

**Happy Coding! 🚀**
