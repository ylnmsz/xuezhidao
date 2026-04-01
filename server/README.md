# Xuezhidao Server

## Setup

1. Copy `.env.example` to `.env` and update values.
2. Install dependencies:
   - `npm install`
3. Run dev server:
   - `npm run dev`

## API Base

- http://localhost:4000/api

## Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users/me`
- `GET /api/users/:id`
- `GET /api/classes`
- `GET /api/classes/:id`
- `GET /api/assignments`
- `GET /api/assignments/:id`
- `GET /api/assignments/:id/submissions`
- `GET /api/questions`
- `GET /api/questions/:id`
- `GET /api/messages`
- `GET /api/messages/:id`
- `GET /api/rankings/student`
- `GET /api/rankings/class`
- `GET /api/errorbook`
- `GET /api/errorbook/:id`
- `GET /api/analytics/overview`
- `GET /api/analytics/class/:id`
