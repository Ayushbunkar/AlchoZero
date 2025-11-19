# AlchoZero API Documentation

Complete API reference for the AlchoZero alcohol detection and monitoring system.

## Base URL
```
http://localhost:4500/api
```

## Authentication

The API uses JWT (JSON Web Token) authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Getting a Token
Obtain a token by logging in through the `/auth/login` endpoint.

---

## API Endpoints

### 🔐 Authentication Endpoints

#### Register User
**POST** `/auth/register`

Create a new user account with device and vehicle setup.

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (required)",
  "password": "string (required)",
  "role": "string (optional: 'driver' | 'admin' | 'superadmin', default: 'driver')",
  "emergencyContact": "string (optional)",
  "threshold": "number (optional, default: 0.7, range: 0-1)"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string"
  },
  "token": "string (JWT token)",
  "deviceId": "string"
}
```

**Errors:**
- `400`: Missing required fields
- `409`: Email already registered
- `500`: Server error

---

#### Login
**POST** `/auth/login`

Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string"
  },
  "token": "string (JWT token)",
  "deviceId": "string"
}
```

**Errors:**
- `400`: Missing email or password
- `401`: Invalid credentials
- `500`: Server error

---

#### Forgot Password
**POST** `/auth/forgot`

Request password reset (demo endpoint).

**Request Body:**
```json
{
  "email": "string (required)"
}
```

**Response (200):**
```json
{
  "message": "If that email exists, a reset link was sent."
}
```

---

#### Refresh Token
**POST** `/auth/refresh`

Get a new JWT token.

**Headers:**
```
Authorization: Bearer <current-token>
```

**Response (200):**
```json
{
  "token": "string (new JWT token)"
}
```

**Errors:**
- `401`: Unauthorized (invalid or missing token)

---

### 👤 User Endpoints

#### Get Current User
**GET** `/users`

Get the authenticated user's profile or first user (fallback).

**Headers:**
```
Authorization: Bearer <token> (optional)
```

**Response (200):**
```json
{
  "id": "string",
  "uid": "string",
  "name": "string",
  "email": "string",
  "role": "string",
  "threshold": "number",
  "emergencyContact": "string | null",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

---

#### Update User Settings
**PUT** `/users/settings`

Update authenticated user's settings.

**Headers:**
```
Authorization: Bearer <token> (required)
```

**Request Body:**
```json
{
  "name": "string (optional)",
  "email": "string (optional)",
  "emergencyContact": "string (optional)",
  "threshold": "number (optional, range: 0-1)"
}
```

**Response (200):**
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "role": "string",
  "threshold": "number",
  "emergencyContact": "string | null"
}
```

**Errors:**
- `401`: Authentication required
- `400`: Invalid data

---

### 📱 Device Endpoints

#### Get Devices
**GET** `/devices`

List all devices (admin) or user's devices (driver).

**Headers:**
```
Authorization: Bearer <token> (optional)
```

**Response (200):**
```json
[
  {
    "id": "string",
    "name": "string",
    "type": "string",
    "ownerId": "string",
    "status": "string",
    "lastSeen": "timestamp | null",
    "metadata": {},
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
]
```

---

#### Add Device
**POST** `/devices/add`

Create a new device.

**Request Body:**
```json
{
  "name": "string (required)",
  "type": "string (optional, default: 'breathalyzer')",
  "ownerId": "string (optional, defaults to authenticated user)",
  "status": "string (optional, default: 'active')"
}
```

**Response (200):**
```json
{
  "id": "string",
  "name": "string",
  "type": "string",
  "ownerId": "string",
  "status": "string",
  "createdAt": "timestamp"
}
```

**Errors:**
- `400`: Invalid data

---

#### Bind Device
**POST** `/devices/bind`

Bind a device to the authenticated user.

**Headers:**
```
Authorization: Bearer <token> (required)
```

**Request Body:**
```json
{
  "deviceId": "string (required)"
}
```

**Response (200):**
```json
{
  "deviceId": "string"
}
```

**Errors:**
- `400`: deviceId required
- `401`: Unauthorized
- `404`: Device not found
- `409`: Device already owned by another user

---

### 📊 Event Endpoints

#### Get Events
**GET** `/events`

List events with optional filters.

**Query Parameters:**
- `deviceId` (optional): Filter by device ID
- `limit` (optional): Max results (1-100, default: 50)
- `from` (optional): Start date (ISO format)
- `to` (optional): End date (ISO format)

**Headers:**
```
Authorization: Bearer <token> (optional)
```

**Response (200):**
```json
[
  {
    "id": "string",
    "deviceId": "string",
    "riskLevel": "string (low | medium | high | critical)",
    "detectedValue": "number | null",
    "speed": "number | null",
    "distanceDelta": "number | null",
    "location": "object | null",
    "metadata": {},
    "timestamp": "timestamp",
    "createdAt": "timestamp"
  }
]
```

---

#### Get Recent Events
**GET** `/events/recent`

Get recent events (shorthand for limited events).

**Query Parameters:**
- `deviceId` (optional): Filter by device ID
- `limit` (optional): Max results (1-100, default: 10)
- `from` (optional): Start date
- `to` (optional): End date

**Response:** Same as Get Events

---

#### Get My Events
**GET** `/events/mine`

Get events for authenticated user's devices.

**Headers:**
```
Authorization: Bearer <token> (required)
```

**Query Parameters:**
- `limit` (optional): Max results (1-200, default: 50)

**Response (200):**
```json
[
  {
    "id": "string",
    "deviceId": "string",
    "riskLevel": "string",
    "detectedValue": "number | null",
    "timestamp": "timestamp"
  }
]
```

---

#### Seed Event
**POST** `/events/seed`

Create a random test event for demo purposes.

**Headers:**
```
Authorization: Bearer <token> (required)
```

**Request Body:**
```json
{
  "deviceId": "string (optional, uses user's first device if omitted)"
}
```

**Response (200):**
```json
{
  "id": "string",
  "deviceId": "string",
  "riskLevel": "string",
  "detectedValue": "number",
  "speed": "number",
  "distanceDelta": "number",
  "metadata": {},
  "timestamp": "timestamp"
}
```

**Errors:**
- `400`: deviceId required (if no user devices)
- `401`: Unauthorized

---

#### Event Stream (SSE)
**GET** `/events/stream`

Server-Sent Events stream for real-time event updates.

**Headers:**
```
Authorization: Bearer <token> (required)
```

**Response:** Continuous stream of events every 5 seconds
```
Content-Type: text/event-stream

data: {"id":"...","deviceId":"...","riskLevel":"...","timestamp":"..."}
```

---

### 🚗 Vehicle Endpoints

#### Get Vehicles
**GET** `/vehicles`

List all vehicles.

**Response (200):**
```json
[
  {
    "id": "string",
    "licensePlate": "string",
    "model": "string",
    "deviceId": "string",
    "ownerId": "string",
    "currentDriverId": "string | null",
    "status": "string",
    "metadata": {},
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
]
```

---

#### Add Vehicle
**POST** `/vehicles/add`

Create a new vehicle.

**Request Body:**
```json
{
  "licensePlate": "string (required, alias: 'plate')",
  "model": "string (optional, alias: 'make')",
  "deviceId": "string (optional)",
  "currentDriverId": "string (optional)",
  "ownerId": "string (optional, defaults to authenticated user)"
}
```

**Response (200):**
```json
{
  "id": "string",
  "licensePlate": "string",
  "model": "string",
  "deviceId": "string",
  "ownerId": "string",
  "currentDriverId": "string | null",
  "status": "string",
  "createdAt": "timestamp"
}
```

**Errors:**
- `400`: licensePlate is required

---

### 🚙 Driver Endpoints

#### List Drivers
**GET** `/drivers`

Get list of drivers (placeholder endpoint).

**Response (200):**
```json
[]
```

---

#### Get Driver
**GET** `/drivers/:id`

Get driver details by ID (placeholder endpoint).

**Response (404):**
```json
{
  "message": "Driver not found - using Firebase"
}
```

---

#### Capture Driver Photos
**POST** `/drivers/:id/capture`

Capture photos for driver (admin/superadmin only).

**Headers:**
```
Authorization: Bearer <token> (required, admin or superadmin role)
```

**Response (501):**
```json
{
  "message": "Feature not implemented - using Firebase"
}
```

**Errors:**
- `403`: Forbidden (not admin/superadmin)

---

#### Get Driver Statistics
**GET** `/drivers/me/stats`

Get statistics for authenticated driver.

**Headers:**
```
Authorization: Bearer <token> (required)
```

**Response (200):**
```json
{
  "averageSpeed": "number",
  "totalDistance": "number",
  "drivingScore": "number",
  "totalTrips": "number",
  "riskEvents": {
    "low": "number",
    "medium": "number",
    "high": "number",
    "critical": "number"
  }
}
```

**Errors:**
- `401`: Unauthorized

---

### 📸 Upload Endpoints

#### Upload Driver Photo
**POST** `/upload/driver-photo`

Upload driver photo to Cloudinary.

**Headers:**
```
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
- `photo`: File (required, image file)

**Response (200):**
```json
{
  "success": true,
  "url": "string (Cloudinary URL)",
  "public_id": "string"
}
```

**Errors:**
- `400`: No file uploaded
- `500`: Upload failed

---

#### Delete Driver Photo
**DELETE** `/upload/driver-photo`

Delete driver photo from Cloudinary.

**Headers:**
```
Authorization: Bearer <token> (required)
```

**Request Body:**
```json
{
  "public_id": "string (required)"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

**Errors:**
- `400`: Public ID required
- `500`: Delete failed

---

### 🔍 Detection Endpoints

#### Receive Detection
**POST** `/detection/update`

Receive detection data from device.

**Request Body:**
```json
{
  "deviceId": "string (required)",
  "confidence": "number (required, range: 0-1)",
  "status": "string (optional)"
}
```

**Response (200):**
```json
{
  "success": true,
  "detection": {
    "id": "string",
    "deviceId": "string",
    "riskLevel": "string",
    "detectedValue": "number",
    "timestamp": "timestamp"
  },
  "highRisk": "boolean"
}
```

**Side Effects:**
- Creates an event in Firestore
- Sends email notification if high risk (confidence ≥ threshold)

**Errors:**
- `400`: Invalid confidence value
- `500`: Server error

---

### 👥 Me Endpoints

#### Get My Profile
**GET** `/me`

Get authenticated user's profile with device info.

**Headers:**
```
Authorization: Bearer <token> (required)
```

**Response (200):**
```json
{
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string",
    "threshold": "number",
    "emergencyContact": "string | null"
  },
  "deviceId": "string | null"
}
```

**Errors:**
- `404`: User not found
- `500`: Server error

---

#### Update My Profile
**PUT** `/me`

Update authenticated user's profile.

**Headers:**
```
Authorization: Bearer <token> (required)
```

**Request Body:**
```json
{
  "name": "string (optional)",
  "threshold": "number (optional, range: 0-1)",
  "emergencyContact": "string (optional)"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string",
    "threshold": "number",
    "emergencyContact": "string | null"
  }
}
```

**Errors:**
- `400`: Invalid data
- `404`: User not found

---

## Firestore Collection Schemas

### Users Collection (`users`)
```javascript
{
  uid: "string (Firebase Auth UID)",
  name: "string",
  email: "string (lowercase)",
  role: "string (driver | admin | superadmin)",
  passwordHash: "string (bcrypt hash, backup only)",
  emergencyContact: "string | null",
  threshold: "number (0-1, default: 0.7)",
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

**Indexes:**
- `email` (unique)
- `role`

---

### Devices Collection (`devices`)
```javascript
{
  name: "string",
  type: "string (default: 'breathalyzer')",
  ownerId: "string (user uid)",
  status: "string (active | inactive)",
  lastSeen: "timestamp | null",
  metadata: "object",
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

**Indexes:**
- `ownerId`
- `status`

---

### Events Collection (`events`)
```javascript
{
  deviceId: "string (device document ID)",
  riskLevel: "string (low | medium | high | critical)",
  detectedValue: "number | null (0-1 confidence score)",
  speed: "number | null (km/h)",
  distanceDelta: "number | null (km)",
  location: "object | null (lat/lng)",
  metadata: "object (status, message, etc.)",
  timestamp: "timestamp",
  createdAt: "timestamp"
}
```

**Indexes:**
- `deviceId`
- `timestamp` (descending)
- `riskLevel`
- Composite: `deviceId` + `timestamp`

---

### Vehicles Collection (`vehicles`)
```javascript
{
  licensePlate: "string (uppercase)",
  model: "string",
  deviceId: "string (device document ID)",
  ownerId: "string (user uid)",
  currentDriverId: "string | null (user uid)",
  status: "string (available | in-use)",
  metadata: "object",
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

**Indexes:**
- `licensePlate` (unique)
- `ownerId`
- `deviceId`
- `currentDriverId`

---

## Error Response Format

All error responses follow this format:

```json
{
  "message": "string (error description)"
}
```

Common HTTP status codes:
- `400`: Bad Request (invalid input)
- `401`: Unauthorized (missing or invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found (resource doesn't exist)
- `409`: Conflict (duplicate resource)
- `500`: Internal Server Error
- `501`: Not Implemented

---

## Authentication Flow

### 1. Register New User
```bash
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123",
  "role": "driver",
  "threshold": 0.7
}

# Response includes token and deviceId
```

### 2. Login
```bash
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "securepass123"
}

# Response includes token
```

### 3. Use Token
```bash
GET /api/me
Authorization: Bearer <token-from-login>
```

### 4. Refresh Token (Optional)
```bash
POST /api/auth/refresh
Authorization: Bearer <old-token>

# Get new token with extended expiry
```

---

## Role-Based Access Control

### Roles
- **driver**: Standard user with access to own data
- **admin**: Can manage devices and view all events
- **superadmin**: Full system access

### Role Permissions

| Endpoint | driver | admin | superadmin |
|----------|--------|-------|------------|
| Auth (register/login) | ✅ | ✅ | ✅ |
| Own profile (/me) | ✅ | ✅ | ✅ |
| Own devices | ✅ | ✅ | ✅ |
| All devices | ❌ | ✅ | ✅ |
| Own events | ✅ | ✅ | ✅ |
| All events | ❌ | ✅ | ✅ |
| Capture photos | ❌ | ✅ | ✅ |
| User management | ❌ | ✅ | ✅ |

---

## Rate Limiting

Currently no rate limiting is implemented. For production deployment, consider adding rate limiting middleware.

---

## CORS

CORS is enabled for all origins in development. Configure appropriate CORS settings for production.

---

## Environment Variables

Required environment variables:

```env
# Firebase Admin SDK (from Firebase Console)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# Firebase Client SDK (from Firebase Console)
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# JWT Secret for backward compatibility
JWT_SECRET=your-jwt-secret-key

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email (for notifications)
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password
EMERGENCY_EMAIL=emergency@example.com
```

---

## Example Integration (JavaScript)

### Basic Setup
```javascript
const API_BASE_URL = 'http://localhost:4500/api';
let authToken = null;

// Set auth token after login
function setAuthToken(token) {
  authToken = token;
}

// Make authenticated request
async function apiRequest(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
}
```

### Login Example
```javascript
async function login(email, password) {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  setAuthToken(data.token);
  return data;
}

// Usage
const user = await login('john@example.com', 'password123');
console.log('Logged in:', user);
```

### Get Events Example
```javascript
async function getMyEvents(limit = 50) {
  return await apiRequest(`/events/mine?limit=${limit}`);
}

// Usage
const events = await getMyEvents(20);
console.log('My events:', events);
```

### Send Detection Example
```javascript
async function sendDetection(deviceId, confidence, status = 'Normal') {
  return await apiRequest('/detection/update', {
    method: 'POST',
    body: JSON.stringify({ deviceId, confidence, status }),
  });
}

// Usage
const result = await sendDetection('device123', 0.85, 'High Risk');
if (result.highRisk) {
  console.warn('High risk detection! Emergency notification sent.');
}
```

### Event Stream (SSE) Example
```javascript
function subscribeToEvents() {
  const eventSource = new EventSource(
    `${API_BASE_URL}/events/stream`,
    { headers: { Authorization: `Bearer ${authToken}` } }
  );

  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('New event:', data);
  };

  eventSource.onerror = (error) => {
    console.error('SSE error:', error);
    eventSource.close();
  };

  return eventSource;
}

// Usage
const stream = subscribeToEvents();
// Later: stream.close();
```

### Upload Photo Example
```javascript
async function uploadDriverPhoto(file) {
  const formData = new FormData();
  formData.append('photo', file);

  const response = await fetch(`${API_BASE_URL}/upload/driver-photo`, {
    method: 'POST',
    body: formData,
    // Note: Don't set Content-Type header, browser will set it with boundary
    headers: {
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
  });

  return response.json();
}

// Usage
const fileInput = document.querySelector('input[type="file"]');
const result = await uploadDriverPhoto(fileInput.files[0]);
console.log('Photo URL:', result.url);
```

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:4500/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"pass123","role":"driver"}'
```

### Login
```bash
curl -X POST http://localhost:4500/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}'
```

### Get Events (Authenticated)
```bash
curl http://localhost:4500/api/events/mine?limit=10 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Send Detection
```bash
curl -X POST http://localhost:4500/api/detection/update \
  -H "Content-Type: application/json" \
  -d '{"deviceId":"device123","confidence":0.45,"status":"Normal"}'
```

---

## Support

For issues or questions about the API, contact the development team or refer to the main project README.

---

## Version

**API Version:** 1.0  
**Last Updated:** 2024

---

## License

Proprietary - AlchoZero Project
