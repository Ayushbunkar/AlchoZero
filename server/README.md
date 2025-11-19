# AlchoZero Backend (Node.js + Express + Firebase Firestore)

Production-ready backend for drunk driving/drowsiness detection using Firebase.

## Quick Start

1. **Download Firebase Service Account Key**
   - Go to: https://console.firebase.google.com/project/fftour-5ac79/settings/serviceaccounts/adminsdk
   - Click "Generate New Private Key"
   - Save as: `config/firebase/serviceAccountKey.json`

2. **Install and run**
   ```bash
   npm install
   npm run dev
   ```

Server runs on `http://localhost:4500` by default.

## Configuration

All configuration is in `.env` (already set up with Firebase credentials):
- Firebase Project: `fftour-5ac79`
- JWT Secret: (configured)
- Gmail: (configured)
- Cloudinary: (configured)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh token

### Events
- `GET /api/events` - Get events (with filters)
- `POST /api/events/seed` - Create demo event

### Devices
- `GET /api/devices` - Get devices
- `POST /api/devices/add` - Add device

### Drivers
- `GET /api/drivers/me/stats` - Get driver statistics

### Users
- `GET /api/users` - Get users
- `PUT /api/users/settings` - Update settings

## Firebase Firestore Collections

- `users` - User accounts and profiles
- `devices` - Breathalyzer devices
- `events` - Detection events (auto-seeded every 25s)
- `vehicles` - Vehicle information

## Features

✅ **No MongoDB needed** - Uses Firebase Firestore  
✅ Real-time event seeding (every 25 seconds)  
✅ Firebase Authentication + JWT  
✅ Cloudinary file uploads  
✅ Email notifications  
✅ Auto-scaling cloud database

## Firebase Console

Access your Firebase project:
- **Console**: https://console.firebase.google.com/project/fftour-5ac79
- **Firestore**: https://console.firebase.google.com/project/fftour-5ac79/firestore
- **Auth**: https://console.firebase.google.com/project/fftour-5ac79/authentication
