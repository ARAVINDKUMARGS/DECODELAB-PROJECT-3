# Task Manager API - Complete API Documentation

## 📖 Overview

This document provides comprehensive documentation for all API endpoints, request/response formats, error codes, and usage examples.

**Base URL**: `http://localhost:5000/api/tasks`

**API Version**: `1.0.0`

---

## 🔐 Authentication

Currently, the API does not require authentication. All endpoints are public.

**Future Enhancement**: JWT authentication will be added in v2.0.

---

## 📡 Endpoints

### 1. Create a New Task

#### Request
```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Task title",
  "description": "Optional task description",
  "status": "pending"
}
```

#### Parameters

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `title` | String | YES | 1-100 characters, cannot be empty |
| `description` | String | NO | Max 500 characters, defaults to "" |
| `status` | String | NO | Must be: `pending`, `in-progress`, `completed`. Default: `pending` |

#### Response (201 - Created)
```json
{
  "success": true,
  "data": {
    "_id": "607f1f77bcf86cd799439011",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "status": "pending",
    "createdAt": "2024-03-22T14:30:00.000Z",
    "updatedAt": "2024-03-22T14:30:00.000Z",
    "__v": 0
  },
  "message": "Task created successfully"
}
```

#### Error Examples

**Missing title (400)**
```json
{
  "success": false,
  "error": "Task title is required"
}
```

**Invalid status (400)**
```json
{
  "success": false,
  "error": "Validation Error: Status must be one of: pending, in-progress, completed"
}
```

#### cURL Example
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project report",
    "description": "Finish Q1 performance report",
    "status": "in-progress"
  }'
```

#### JavaScript Example
```javascript
const response = await fetch('http://localhost:5000/api/tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Buy groceries',
    description: 'Milk, eggs, bread',
    status: 'pending'
  })
});
const result = await response.json();
console.log(result);
```

---

### 2. Get All Tasks

Retrieve all tasks with optional filtering, sorting, and pagination.

#### Request
```http
GET /api/tasks?status=pending&sortBy=createdAt&order=desc&limit=10&page=1&search=buy
```

#### Query Parameters

| Parameter | Type | Default | Description | Example |
|-----------|------|---------|-------------|---------|
| `status` | String | - | Filter by status | `pending`, `in-progress`, `completed` |
| `sortBy` | String | `createdAt` | Sort field | `createdAt`, `updatedAt`, `title`, `status` |
| `order` | String | `desc` | Sort order | `asc` (ascending), `desc` (descending) |
| `limit` | Number | `10` | Items per page (max 100) | `5`, `20`, `50` |
| `page` | Number | `1` | Page number | `1`, `2`, `3` |
| `search` | String | - | Search in title (case-insensitive) | `buy`, `shopping`, `urgent` |

#### Response (200 - OK)
```json
{
  "success": true,
  "data": [
    {
      "_id": "607f1f77bcf86cd799439011",
      "title": "Buy groceries",
      "description": "Milk, eggs, bread",
      "status": "pending",
      "createdAt": "2024-03-22T14:30:00.000Z",
      "updatedAt": "2024-03-22T14:30:00.000Z"
    },
    {
      "_id": "607f1f77bcf86cd799439012",
      "title": "Complete project",
      "description": "Finish Q1 project",
      "status": "in-progress",
      "createdAt": "2024-03-21T10:00:00.000Z",
      "updatedAt": "2024-03-21T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "message": "Tasks retrieved successfully"
}
```

#### Query Examples

**Get only pending tasks:**
```http
GET /api/tasks?status=pending
```

**Get completed tasks, sorted by title A-Z:**
```http
GET /api/tasks?status=completed&sortBy=title&order=asc
```

**Search for tasks containing "shopping":**
```http
GET /api/tasks?search=shopping
```

**Get page 2 with 20 results per page:**
```http
GET /api/tasks?limit=20&page=2
```

**Complex filter (pending, sorted by date, search, pagination):**
```http
GET /api/tasks?status=pending&sortBy=createdAt&order=desc&limit=10&page=1&search=urgent
```

**Get in-progress tasks sorted by title:**
```http
GET /api/tasks?status=in-progress&sortBy=title&order=asc
```

#### cURL Example
```bash
# Get all tasks
curl http://localhost:5000/api/tasks

# Get pending tasks
curl "http://localhost:5000/api/tasks?status=pending"

# Search and filter
curl "http://localhost:5000/api/tasks?search=shopping&sortBy=createdAt&order=desc&limit=10"
```

#### JavaScript Example
```javascript
// Get all tasks
const response = await fetch('http://localhost:5000/api/tasks');
const result = await response.json();
console.log(result.data);

// Get with filters
const url = new URL('http://localhost:5000/api/tasks');
url.searchParams.append('status', 'pending');
url.searchParams.append('limit', '20');
url.searchParams.append('page', '1');

const response = await fetch(url);
const result = await response.json();
console.log(result.data);
```

---

### 3. Get Task Statistics

Retrieve statistics about tasks grouped by status.

#### Request
```http
GET /api/tasks/stats/summary
```

#### Response (200 - OK)
```json
{
  "success": true,
  "data": {
    "total": 50,
    "byStatus": {
      "pending": 20,
      "in-progress": 15,
      "completed": 15
    }
  },
  "message": "Task statistics retrieved successfully"
}
```

#### cURL Example
```bash
curl http://localhost:5000/api/tasks/stats/summary
```

#### JavaScript Example
```javascript
const response = await fetch('http://localhost:5000/api/tasks/stats/summary');
const result = await response.json();
console.log(result.data);
```

---

### 4. Get Single Task

Retrieve a specific task by its ID.

#### Request
```http
GET /api/tasks/{taskId}
```

#### URL Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `taskId` | String (ObjectId) | MongoDB task ID (24 hex characters) |

#### Response (200 - OK)
```json
{
  "success": true,
  "data": {
    "_id": "607f1f77bcf86cd799439011",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "status": "pending",
    "createdAt": "2024-03-22T14:30:00.000Z",
    "updatedAt": "2024-03-22T14:30:00.000Z"
  },
  "message": "Task retrieved successfully"
}
```

#### Error Examples

**Invalid ID format (400)**
```json
{
  "success": false,
  "error": "Invalid task ID format"
}
```

**Task not found (404)**
```json
{
  "success": false,
  "error": "Task not found"
}
```

#### cURL Example
```bash
curl http://localhost:5000/api/tasks/607f1f77bcf86cd799439011
```

#### JavaScript Example
```javascript
const taskId = '607f1f77bcf86cd799439011';
const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`);
const result = await response.json();
console.log(result.data);
```

---

### 5. Update a Task

Update one or more fields of an existing task.

#### Request
```http
PUT /api/tasks/{taskId}
Content-Type: application/json

{
  "title": "Updated title",
  "description": "Updated description",
  "status": "completed"
}
```

#### URL Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `taskId` | String (ObjectId) | MongoDB task ID |

#### Request Body (at least one field required)

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `title` | String | NO | 1-100 characters |
| `description` | String | NO | Max 500 characters |
| `status` | String | NO | `pending`, `in-progress`, `completed` |

#### Response (200 - OK)
```json
{
  "success": true,
  "data": {
    "_id": "607f1f77bcf86cd799439011",
    "title": "Buy organic groceries",
    "description": "Milk, eggs, bread",
    "status": "completed",
    "createdAt": "2024-03-22T14:30:00.000Z",
    "updatedAt": "2024-03-22T15:45:00.000Z"
  },
  "message": "Task updated successfully"
}
```

#### Error Examples

**Invalid ID format (400)**
```json
{
  "success": false,
  "error": "Invalid task ID format"
}
```

**Task not found (404)**
```json
{
  "success": false,
  "error": "Task not found"
}
```

**No fields to update (400)**
```json
{
  "success": false,
  "error": "No fields to update"
}
```

#### cURL Example
```bash
# Update status only
curl -X PUT http://localhost:5000/api/tasks/607f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'

# Update all fields
curl -X PUT http://localhost:5000/api/tasks/607f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New title",
    "description": "New description",
    "status": "in-progress"
  }'
```

#### JavaScript Example
```javascript
const taskId = '607f1f77bcf86cd799439011';
const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    status: 'completed'
  })
});
const result = await response.json();
console.log(result.data);
```

---

### 6. Delete a Task

Delete an existing task.

#### Request
```http
DELETE /api/tasks/{taskId}
```

#### URL Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `taskId` | String (ObjectId) | MongoDB task ID |

#### Response (200 - OK)
```json
{
  "success": true,
  "data": null,
  "message": "Task deleted successfully"
}
```

#### Error Examples

**Invalid ID format (400)**
```json
{
  "success": false,
  "error": "Invalid task ID format"
}
```

**Task not found (404)**
```json
{
  "success": false,
  "error": "Task not found"
}
```

#### cURL Example
```bash
curl -X DELETE http://localhost:5000/api/tasks/607f1f77bcf86cd799439011
```

#### JavaScript Example
```javascript
const taskId = '607f1f77bcf86cd799439011';
const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
  method: 'DELETE'
});
const result = await response.json();
console.log(result);
```

---

## 📊 Data Models

### Task Object

```json
{
  "_id": "607f1f77bcf86cd799439011",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "status": "pending",
  "createdAt": "2024-03-22T14:30:00.000Z",
  "updatedAt": "2024-03-22T14:30:00.000Z",
  "__v": 0
}
```

#### Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Unique task identifier (auto-generated) |
| `title` | String | Task title/name |
| `description` | String | Detailed task description |
| `status` | String | Current task status |
| `createdAt` | ISO 8601 DateTime | Task creation timestamp |
| `updatedAt` | ISO 8601 DateTime | Last update timestamp |
| `__v` | Number | Mongoose version indicator |

### Status Values

| Value | Description |
|-------|-------------|
| `pending` | Task not yet started |
| `in-progress` | Task currently being worked on |
| `completed` | Task finished |

---

## ❌ HTTP Status Codes

| Code | Meaning | Common Causes |
|------|---------|---------------|
| `200` | OK | Request succeeded |
| `201` | Created | Resource created successfully |
| `400` | Bad Request | Invalid input, missing fields, invalid format |
| `404` | Not Found | Resource doesn't exist |
| `409` | Conflict | Duplicate entry |
| `500` | Server Error | Internal server error |

---

## 🚨 Error Handling

### Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

### Common Error Messages

| Error | Meaning | Solution |
|-------|---------|----------|
| "Task title is required" | Missing title field | Add `title` to request body |
| "Invalid task ID format" | Malformed ObjectId | Use valid 24-character MongoDB ID |
| "Task not found" | ID doesn't exist in database | Verify task ID is correct and exists |
| "Status must be one of..." | Invalid status value | Use: `pending`, `in-progress`, or `completed` |
| "No fields to update" | Empty update body | Include at least one field to update |

---

## 🧪 Testing Workflow

### 1. Test All Create Operations

```bash
# Create a new task
POST /api/tasks
{
  "title": "Learn Node.js",
  "description": "Complete Node.js tutorial",
  "status": "pending"
}

# Expected: 201 status with created task data
# Save the _id from response for next tests
```

### 2. Test Read Operations

```bash
# Get all tasks
GET /api/tasks
# Expected: 200 status with task list and pagination

# Get specific task
GET /api/tasks/{SAVED_ID}
# Expected: 200 status with task details

# Get statistics
GET /api/tasks/stats/summary
# Expected: 200 status with count by status
```

### 3. Test Filtering and Pagination

```bash
# Filter by status
GET /api/tasks?status=pending
# Expected: Only pending tasks

# Pagination
GET /api/tasks?limit=5&page=1
# Expected: 5 tasks and pagination info

# Search
GET /api/tasks?search=learn
# Expected: Tasks with "learn" in title
```

### 4. Test Update Operations

```bash
# Update status
PUT /api/tasks/{SAVED_ID}
{
  "status": "in-progress"
}
# Expected: 200 status with updated task

# Update title
PUT /api/tasks/{SAVED_ID}
{
  "title": "Advanced Node.js"
}
# Expected: 200 status with updated task
```

### 5. Test Delete Operations

```bash
# Delete task
DELETE /api/tasks/{SAVED_ID}
# Expected: 200 status with success message

# Verify deletion
GET /api/tasks/{SAVED_ID}
# Expected: 404 status (not found)
```

### 6. Test Error Cases

```bash
# Missing required field
POST /api/tasks
{
  "description": "No title"
}
# Expected: 400 status with error

# Invalid ID format
GET /api/tasks/invalid-id
# Expected: 400 status with error

# Non-existent ID
GET /api/tasks/607f1f77bcf86cd799439999
# Expected: 404 status with error
```

---

## 📝 Postman Collection

Import this collection into Postman for easy testing.

### Create Postman Environment

Set these environment variables:
- `BASE_URL` = `http://localhost:5000/api/tasks`
- `TASK_ID` = (dynamically populated from POST response)

### Postman Requests

**Create Task**
```
POST {{BASE_URL}}
Content-Type: application/json

{
  "title": "Sample Task",
  "description": "Sample Description",
  "status": "pending"
}
```

**Get All Tasks**
```
GET {{BASE_URL}}
```

**Get Filtered Tasks**
```
GET {{BASE_URL}}?status=pending&limit=10&page=1
```

**Get Statistics**
```
GET {{BASE_URL}}/stats/summary
```

**Get Single Task**
```
GET {{BASE_URL}}/{{TASK_ID}}
```

**Update Task**
```
PUT {{BASE_URL}}/{{TASK_ID}}
Content-Type: application/json

{
  "status": "completed"
}
```

**Delete Task**
```
DELETE {{BASE_URL}}/{{TASK_ID}}
```

---

## 🔗 Related Resources

- [README.md](./README.md) - Project overview
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Installation instructions
- [Postman](https://www.postman.com/) - API testing tool
- [MongoDB Documentation](https://docs.mongodb.com/) - Database documentation
- [Express.js Documentation](https://expressjs.com/) - Web framework documentation
- [Mongoose Documentation](https://mongoosejs.com/) - MongoDB ODM documentation

---

## 📞 Support

For issues or questions:

1. Check the [README.md](./README.md) troubleshooting section
2. Review the [SETUP_GUIDE.md](./SETUP_GUIDE.md) for setup issues
3. Verify MongoDB is running
4. Check server console for error messages
5. Ensure all dependencies are installed

---

**Version**: 1.0.0  
**Last Updated**: March 22, 2024  
**Status**: Production Ready ✓

