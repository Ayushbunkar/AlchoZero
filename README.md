# AlchoZero - Drunk Driving Detection System

Professional drunk driving detection and monitoring system powered by Firebase.

## 🏢 Project Structure

```
AlchoZero/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   └── package.json
│
├── server/                 # Backend API server
│   ├── config/            # Configuration files
│   ├── controllers/       # Request handlers
│   ├── routes/            # API routes
│   ├── services/          # Business logic (Firebase)
│   ├── utils/             # Helper functions
│   └── server.js          # Entry point
│
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Firebase account
- Firebase service account key

### Installation

**1. Clone and install:**
```bash
git clone https://github.com/Ayushbunkar/AlchoZero.git
cd AlchoZero
```

**2. Setup Firebase:**
- Download service account key from [Firebase Console](https://console.firebase.google.com/project/fftour-5ac79/settings/serviceaccounts/adminsdk)
- Save as: `server/config/firebase/serviceAccountKey.json`

**3. Start Server:**
```bash
cd server
npm install
npm run dev
```

**4. Start Client:**
```bash
cd client
npm install
npm run dev
```

## 🔧 Configuration

All environment variables are pre-configured in `server/.env`:
- Firebase Project: `fftour-5ac79`
- Firebase credentials included
- Gmail SMTP configured
- Cloudinary configured

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token

### Events
- `GET /api/events` - Get detection events
- `POST /api/events/seed` - Create demo event

### Devices
- `GET /api/devices` - Get all devices
- `POST /api/devices/add` - Add new device

### Drivers
- `GET /api/drivers/me/stats` - Get driver statistics

### Users
- `GET /api/users` - Get users (admin)
- `PUT /api/users/settings` - Update user settings

## 🗄️ Database

**Firebase Firestore Collections:**
- `users` - User accounts and profiles
- `devices` - Breathalyzer devices
- `events` - Detection events (auto-generated)
- `vehicles` - Vehicle information

## 🎯 Features

- ✅ Real-time event monitoring
- ✅ Risk level detection (Low, Medium, High, Critical)
- ✅ Driver performance analytics
- ✅ Device management
- ✅ Email notifications
- ✅ Cloud-hosted database
- ✅ JWT authentication
- ✅ Role-based access (Driver, Admin, SuperAdmin)

## 🔐 Security

- Firebase Authentication + JWT
- Role-based access control
- Firestore security rules
- Environment variables for secrets

## 📊 Tech Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- Firebase SDK
- Recharts

**Backend:**
- Node.js
- Express.js
- Firebase Admin SDK
- Firestore
- JWT

**Cloud Services:**
- Firebase (Database, Auth, Storage)
- Cloudinary (Image uploads)
- Gmail SMTP (Notifications)

## 🌐 Links

- **Firebase Console**: https://console.firebase.google.com/project/fftour-5ac79
- **Firestore**: https://console.firebase.google.com/project/fftour-5ac79/firestore
- **Repository**: https://github.com/Ayushbunkar/AlchoZero

## 📝 License

MIT License

## 👥 Team

Developed by Ayush Bunkar and team

---

**Built with Firebase • No MongoDB Required**
