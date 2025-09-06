# Campus Event System (Final Project)

Hi, I am Vishal Patel and this is my final project. I made a small campus event management system where students can register for events and admins can see reports. I used Flask with SQLite for the backend and React (Vite + Tailwind) for the frontend. I am not that good at writing but I will explain it in my own way.

## What it does
- Students can see events and register.
- Attendance and feedback can be added.
- Admins can see which events are popular, which students are most active, and filter events by type.
- I added a student portal page and an admin dashboard page in frontend.

## Tech I used
- Backend: Python Flask + SQLite (simple db file so it runs easily).
- Frontend: React with Vite and TailwindCSS.
- Extra: Recharts for charts, Framer Motion for animations, Lucide icons for style.

## How to run

### Backend
```
cd webknot_event_system_improved_final
python init_db.py   # sets up database with some sample data
python app.py       # starts the flask server
```
Backend runs on: **http://127.0.0.1:5000**

### Frontend
```
cd frontend-react
npm install
npm run dev
```
Frontend runs on: **http://localhost:5173**

## Pages
- Student Portal → see events, register, check participation.
- Admin Dashboard → charts for event popularity, top 3 active students, filter events by type.

## My notes
I am 20 and still learning. I used AI tools to help me build this project but I tried to understand each part myself. This project helped me learn how backend and frontend connect together. It feels good to see it working with charts and data. It’s not perfect but I learned a lot while making it.
