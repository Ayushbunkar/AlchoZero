# AlchoZero - Integration Quick Start

## For External Developers

This document provides a quick guide for integrating with the AlchoZero API.

## 📚 Documentation Files

- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Complete API reference with all endpoints, schemas, and examples
- **[README.md](./README.md)** - Project overview and setup instructions

## 🚀 Quick Integration Guide

### 1. Get API Access

Contact the AlchoZero team to get:
- Base API URL (production)
- API credentials (if required)
- Test account for development

**Development Base URL:** `http://localhost:4500/api`  
**Production Base URL:** (Contact team)

### 2. Authentication Flow

```javascript
// 1. Login to get token
const response = await fetch('http://localhost:4500/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'your-email@example.com',
    password: 'your-password'
  })
});

const { token, user, deviceId } = await response.json();

// 2. Use token for authenticated requests
const eventsResponse = await fetch('http://localhost:4500/api/events/mine', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const events = await eventsResponse.json();
```

### 3. Common Integration Scenarios

#### Scenario A: Send Detection Data
```javascript
// Your device/app sends alcohol detection data
await fetch('http://localhost:4500/api/detection/update', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    deviceId: 'your-device-id',
    confidence: 0.85,  // 0-1 range (0.85 = 85% confidence)
    status: 'High Risk'
  })
});

// AlchoZero will:
// - Store the event in Firestore
// - Send email if high risk
// - Make data available via API
```

#### Scenario B: Monitor Events in Real-Time
```javascript
// Server-Sent Events stream
const eventSource = new EventSource(
  'http://localhost:4500/api/events/stream',
  { headers: { Authorization: `Bearer ${token}` } }
);

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('New detection:', data);
  // Handle real-time event in your app
};
```

#### Scenario C: Get Historical Data
```javascript
// Get last 100 events for analysis
const response = await fetch(
  'http://localhost:4500/api/events?limit=100&from=2024-01-01',
  { headers: { Authorization: `Bearer ${token}` } }
);

const events = await response.json();

// Process events for analytics, reporting, etc.
events.forEach(event => {
  console.log(`Device: ${event.deviceId}, Risk: ${event.riskLevel}`);
});
```

#### Scenario D: Manage Devices
```javascript
// Add a new device
const response = await fetch('http://localhost:4500/api/devices/add', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    name: 'Breathalyzer Unit 42',
    type: 'breathalyzer',
    status: 'active'
  })
});

const device = await response.json();
console.log('New device ID:', device.id);
```

### 4. Response Formats

#### Success Response
```json
{
  "id": "abc123",
  "deviceId": "device456",
  "riskLevel": "high",
  "detectedValue": 0.85,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### Error Response
```json
{
  "message": "Invalid credentials"
}
```

### 5. Risk Levels

| Risk Level | Confidence Range | Description |
|------------|------------------|-------------|
| `low` | 0.0 - 0.29 | Normal/Safe |
| `medium` | 0.30 - 0.59 | Caution |
| `high` | 0.60 - 0.79 | Warning |
| `critical` | 0.80 - 1.0 | Danger/Alert |

### 6. Rate Limits

Currently no rate limits. For production, contact team for rate limit details.

### 7. Data Schemas

#### Event Schema
```typescript
{
  id: string;
  deviceId: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  detectedValue: number | null;  // 0-1
  speed: number | null;           // km/h
  distanceDelta: number | null;   // km
  location: { lat: number, lng: number } | null;
  metadata: object;
  timestamp: Date;
  createdAt: Date;
}
```

#### Device Schema
```typescript
{
  id: string;
  name: string;
  type: string;
  ownerId: string;
  status: 'active' | 'inactive';
  lastSeen: Date | null;
  metadata: object;
  createdAt: Date;
  updatedAt: Date;
}
```

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete schemas.

### 8. Environment Setup

If running locally:

```bash
# Clone repository
git clone https://github.com/Ayushbunkar/AlchoZero.git
cd AlchoZero

# Install dependencies
cd server && npm install
cd ../client && npm install

# Start server (port 4500)
cd ../server && npm run dev

# Start client (port 5173)
cd ../client && npm run dev
```

### 9. Testing

Use the provided cURL examples or Postman collection (contact team).

Example test:
```bash
# Test login
curl -X POST http://localhost:4500/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 10. Support & Contact

- **Documentation**: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **Issues**: Create GitHub issue or contact team
- **Email**: ayushbunkar100@gmail.com

## 🔗 Integration Checklist

- [ ] Read complete API documentation
- [ ] Get test account credentials
- [ ] Test authentication flow
- [ ] Test sending detection data
- [ ] Test retrieving events
- [ ] Handle error responses
- [ ] Implement retry logic
- [ ] Test in production environment
- [ ] Monitor API usage
- [ ] Set up error logging

## 📦 SDK/Libraries (Coming Soon)

Official SDKs for popular languages are in development:
- JavaScript/TypeScript SDK
- Python SDK
- Java/Kotlin SDK

For now, use standard HTTP requests as shown in examples above.

## 🛡️ Security Best Practices

1. **Never expose JWT tokens** in client-side code
2. **Store tokens securely** (secure storage, not localStorage)
3. **Refresh tokens** before expiry (7-day expiry)
4. **Use HTTPS** in production
5. **Validate all input** before sending to API
6. **Handle errors gracefully** with user-friendly messages
7. **Log API failures** for debugging

## 💡 Tips

- Use the `/events/seed` endpoint to generate test data
- Check `/events/recent?limit=10` for quick monitoring
- Use SSE `/events/stream` for real-time dashboards
- Filter events by `deviceId` for device-specific data
- The API returns ISO 8601 timestamps (convert to local time)

---

**Ready to integrate? Start with [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)!**
