# Task Manager API - Complete Setup Guide

A step-by-step guide to set up and run the Task Manager API locally.

## 📋 Prerequisites

Before starting, ensure you have:

1. **Node.js** (v14 or higher)
   - Download: https://nodejs.org/
   - Verify: `node --version` and `npm --version`

2. **MongoDB** (one of the options below)
   - **Option A**: Local MongoDB installation
   - **Option B**: MongoDB Atlas (cloud database - free tier available)

3. **Git** (Optional)
   - Download: https://git-scm.com/

4. **Text Editor/IDE**
   - VS Code: https://code.visualstudio.com/
   - WebStorm, Sublime Text, or any preferred editor

5. **API Testing Tool** (Optional but recommended)
   - Postman: https://www.postman.com/
   - Insomnia: https://insomnia.rest/

## 🔧 Installation Steps

### Step 1: Navigate to Project Directory

```bash
# Windows
cd "C:\Users\Admin\OneDrive\Desktop\New folder (2)\task-manager-api"

# Linux/Mac
cd ~/path/to/task-manager-api
```

### Step 2: Initialize MongoDB

**Option A: Using Local MongoDB**

1. Install MongoDB Community Edition:
   - Windows: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/
   - Mac: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-macos/
   - Linux: https://docs.mongodb.com/manual/administration/install-on-linux/

2. Start MongoDB (create a terminal/command prompt for this):
   ```bash
   # Linux/Mac
   mongod
   
   # Windows (if installed as service)
   # MongoDB runs automatically
   # Or start manually:
   "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"
   ```

3. Verify MongoDB is running:
   ```bash
   mongo
   # or
   mongosh
   ```

**Option B: Using MongoDB Atlas (Cloud)**

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster
4. Create a database user
5. Get connection string (it will be something like):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/task-manager
   ```

### Step 3: Install Node Dependencies

```bash
npm install
```

This will install all required packages:
- express
- mongoose
- dotenv
- cors
- nodemon (for development)

**Expected output:**
```
added 100+ packages in 30s
```

### Step 4: Configure Environment Variables

Option A: Using .env file (already exists)
```bash
# .env file content (already set up)
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/task-manager
LOG_LEVEL=debug
```

Option B: If using MongoDB Atlas, update .env:
```bash
# Open .env file and replace MONGODB_URI with:
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/task-manager
```

### Step 5: Start the Development Server

```bash
npm run dev
```

**Expected output:**
```
╔════════════════════════════════════════════════════════════╗
║         Task Manager API Server Started                    ║
╚════════════════════════════════════════════════════════════╝

📊 Application Information:
   • Environment: development
   • Port: 5000
   • Server URL: http://localhost:5000
   • API Base URL: http://localhost:5000/api

🔗 Quick Links:
   • Health Check: http://localhost:5000/health
   • Root Endpoint: http://localhost:5000/
   • Task API: http://localhost:5000/api/tasks

✓ Ready to accept requests...
```

### Step 6: Verify Installation

Open a new terminal/command prompt and test:

```bash
# Test 1: Health check
curl http://localhost:5000/health

# Expected response:
# {"status":"OK","message":"Task Manager API is running"}

# Test 2: Get all tasks (should be empty initially)
curl http://localhost:5000/api/tasks

# Expected response:
# {"success":true,"data":[],"pagination":{...},"message":"Tasks retrieved successfully"}
```

Or open in browser:
- Health Check: http://localhost:5000/health
- Root: http://localhost:5000/
- Tasks: http://localhost:5000/api/tasks

## ✅ Verification Checklist

After setup, verify everything is working:

- [ ] Node.js installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] MongoDB running (port 27017)
- [ ] Dependencies installed (`node_modules` folder exists)
- [ ] `.env` file configured
- [ ] Server starts without errors
- [ ] Health check endpoint responds
- [ ] Can fetch tasks (GET /api/tasks)

## 🧪 Testing the API

### Method 1: Using cURL (Terminal)

```bash
# Create a new task
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "status": "pending"
  }'

# Get all tasks
curl http://localhost:5000/api/tasks

# Filter by status
curl "http://localhost:5000/api/tasks?status=pending"

# Get a specific task (replace ID)
curl http://localhost:5000/api/tasks/[TASK_ID]

# Update a task
curl -X PUT http://localhost:5000/api/tasks/[TASK_ID] \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'

# Delete a task
curl -X DELETE http://localhost:5000/api/tasks/[TASK_ID]
```

### Method 2: Using Postman

1. **Download and Install Postman**: https://www.postman.com/downloads/
2. **Create Collection**: "Task Manager API"
3. **Create Environment**: Set `BASE_URL = http://localhost:5000/api/tasks`
4. **Create Requests**:

**Create Task Request:**
```
POST http://localhost:5000/api/tasks
Header: Content-Type: application/json

Body (JSON):
{
  "title": "Learn Node.js",
  "description": "Complete Node.js course",
  "status": "in-progress"
}
```

**Get All Tasks Request:**
```
GET http://localhost:5000/api/tasks
```

**Update Task Request:**
```
PUT http://localhost:5000/api/tasks/[paste_task_id]
Header: Content-Type: application/json

Body (JSON):
{
  "status": "completed"
}
```

**Delete Task Request:**
```
DELETE http://localhost:5000/api/tasks/[paste_task_id]
```

### Method 3: Using VS Code REST Client Extension

1. Install "REST Client" extension in VS Code
2. Create `test.http` file:

```http
### Variables
@baseUrl = http://localhost:5000/api/tasks

### Create a task
POST @baseUrl
Content-Type: application/json

{
  "title": "Complete API development",
  "description": "Build and test the task manager API",
  "status": "in-progress"
}

### Get all tasks
GET @baseUrl

### Get tasks with filters
GET @baseUrl?status=pending&limit=5&page=1

### Search tasks
GET @baseUrl?search=api&sortBy=createdAt&order=desc

### Get statistics
GET @baseUrl/stats/summary
```

3. Click "Send Request" above each request

## 🐛 Troubleshooting

### Problem: "Cannot find module 'express'"

**Solution:**
```bash
# Run npm install again
npm install

# Or clear cache and reinstall
npm cache clean --force
npm install
```

### Problem: "MongoDB connection error"

**Solution:**
```bash
# Check if MongoDB is running
# Windows: Check Services or run mongod manually
# Mac/Linux: Run mongod in terminal

# Check connection string in .env
# Verify MONGODB_URI is correct

# Test connection with MongoDB Compass
# Download: https://www.mongodb.com/products/compass
```

### Problem: "Port 5000 is already in use"

**Solution:**
```bash
# Option 1: Change port in .env
PORT=5001

# Option 2: Kill process on port 5000
# Windows: netstat -ano | findstr :5000
# Mac/Linux: lsof -i :5000

# Then restart: npm run dev
```

### Problem: "nodemon command not found"

**Solution:**
```bash
# Use node directly instead
node server.js

# Or install nodemon globally
npm install -g nodemon
```

### Problem: "Module not found" errors

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Windows
rmdir /s node_modules
del package-lock.json
npm install
```

## 📂 Project Files Overview

| File | Purpose |
|------|---------|
| `server.js` | Main entry point, Express setup |
| `config/database.js` | MongoDB connection configuration |
| `models/Task.js` | Data schema definition |
| `controllers/taskController.js` | Business logic functions |
| `routes/taskRoutes.js` | API route definitions |
| `middleware/logger.js` | Request logging |
| `middleware/errorHandler.js` | Error handling |
| `.env` | Environment variables |
| `package.json` | Dependencies and scripts |

## 🚀 Running in Production

For production deployment:

```bash
# Install production dependencies only
npm install --production

# Set environment
set NODE_ENV=production

# Start server
npm start
```

## 🔄 Development Workflow

### Daily Development

```bash
# Terminal 1: Start MongoDB
mongod

# Terminal 2: Start development server
npm run dev

# Terminal 3: Make requests/test API
curl http://localhost:5000/api/tasks
```

### Making Changes

1. Edit files in editor (changes auto-reload with nodemon)
2. Test changes with API requests
3. Check console for logs and errors
4. Repeat until feature complete

### Debugging

Add console.log statements:
```javascript
console.log('Debug info:', variable);
```

Check server console output for logs:
- Request timestamps
- Response times
- Errors and stack traces

## 📊 MongoDB Data Management

### View Collections and Data

**Using MongoDB Compass (GUI):**
1. Download: https://www.mongodb.com/products/compass
2. Connect to `mongodb://localhost:27017`
3. View `task-manager` database
4. View `tasks` collection
5. See all stored tasks with full details

**Using mongosh (CLI):**
```bash
# Start mongosh
mongosh

# List databases
show dbs

# Use task-manager database
use task-manager

# View all tasks
db.tasks.find()

# View tasks with formatting
db.tasks.find().pretty()

# Clear all tasks (if needed)
db.tasks.deleteMany({})
```

## 📈 Performance Tips

1. **Use pagination**: `?limit=10&page=1`
2. **Use specific fields**: Request only needed data
3. **Use indexes**: Database queries are indexed for speed
4. **Cache responses**: Implement caching for frequently used data
5. **Monitor logs**: Check server logs for slow queries

## 🎓 Learning Path

1. **Day 1**: Setup and basic CRUD operations
2. **Day 2**: Advance with filtering, sorting, pagination
3. **Day 3**: Add validation and error handling
4. **Day 4**: Test thoroughly with various inputs
5. **Day 5**: Deploy to production

## 🆘 Getting Help

If you encounter issues:

1. Check error messages in server console
2. Review the API_DOCUMENTATION.md file
3. Check MongoDB connection
4. Verify environment variables
5. Ensure all dependencies are installed
6. Check port availability

## ✨ Next Steps After Setup

After successful setup, you can:

1. **Extend the API**: Add user authentication, categories, due dates
2. **Add Testing**: Implement unit and integration tests
3. **Add Validation**: Use libraries like Joi for better validation
4. **Deploy**: Push to production (Heroku, AWS, Azure, etc.)
5. **Monitor**: Add monitoring and analytics
6. **Document**: Add Swagger/OpenAPI documentation

## 📝 Example Workflow

```bash
# 1. Start MongoDB
mongod

# 2. Open new terminal, navigate to project
cd task-manager-api

# 3. Install dependencies (first time only)
npm install

# 4. Start development server
npm run dev

# 5. Open another terminal for testing
# Test create task
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"First task","status":"pending"}'

# 6. View created task
curl http://localhost:5000/api/tasks

# 7. Edit code, see auto-reload
# Make changes to files, they auto-reload

# 8. Test again
# Changes are live!
```

---

## 🎉 Congratulations!

Your Task Manager API is now set up and ready to use. Start building amazing features! 🚀

