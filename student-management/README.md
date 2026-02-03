# Student Management System Website

This folder contains a complete HTML/CSS/JavaScript front-end with a sample Node.js + MySQL backend.

## Pages
- `index.html` — Home
- `login.html` — Login/Register
- `dashboard.html` — Role-based dashboard
- `students.html` — Student list and admin actions
- `attendance.html` — Attendance module
- `results.html` — Marks & assignments
- `contact.html` — Contact form

## Front-end
Open `student-management/index.html` in a browser to view the responsive UI. Navigation links connect each page.

## Database schema (MySQL)
The schema is defined in `backend/schema.sql` and includes tables for roles, users, students, teachers, courses, attendance, marks, assignments, and timetable.

## Backend sample (Node.js + Express)
`backend/server.js` provides sample endpoints:
- `POST /api/auth/register` — register users with hashed passwords
- `POST /api/auth/login` — login and receive JWT
- `GET /api/students` — admin/teacher access
- `POST /api/attendance` — teacher attendance updates
- `POST /api/marks` — teacher marks uploads
- `GET /api/student/profile` — student profile access

### Environment variables
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `JWT_SECRET`
- `PORT`

### Quick start (sample)
```bash
npm install express mysql2 bcryptjs jsonwebtoken
node backend/server.js
```

## Notes
- All inputs are validated in the UI and backend.
- Authentication uses hashed passwords and JWT sessions.
- The UI is responsive for mobile and desktop layouts.
