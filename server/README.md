# AlchoZero Backend (Node.js + Express + MongoDB)

Production-ready backend for drunk driving/drowsiness detection.

## Quick Start

1. Copy env
```
cp .env.example .env
```
2. Fill `MONGO_URI`, email creds (optional), and `CLIENT_ORIGIN`.
3. Install and run
```
npm i
npm run dev
```

Server runs on `http://localhost:4500` by default.

## API Mounts
- `POST /api/detection/update`
- `GET /api/devices`, `POST /api/devices/add`
- `GET /api/events`
- `GET /api/users`, `PUT /api/users/settings`
