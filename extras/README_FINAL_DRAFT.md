# Webknot Campus Event Reporting – Final Submission Draft

**Student:** Vishal Patel
**Email:** vishalpatel2871@gmail.com
**Project:** Campus Event Reporting System (Prototype)
**Date:** 2025-09-05

## Summary (in my own words)
This prototype implements the core data workflows for a campus event management platform: event creation, student registration, attendance tracking, feedback collection, and administrative reporting. I built a Flask API backed by an SQLite database to keep the prototype lightweight and easy to run. The focus was on delivering a complete, testable pipeline that meets the assignment requirements while being clear and maintainable.

## What I implemented
- **Database schema** with tables for colleges, students, events, registrations, attendance, and feedback. Key constraints prevent duplicate registrations and invalid data entries.
- **Flask API** with endpoints to create events/students, register students, mark attendance, submit feedback, and fetch multiple reports (event metrics, popularity, student participation, top active students).
- **Seed script** to populate the database with example colleges, students, events, and randomized registrations/attendance/feedback so reviewers can inspect realistic outputs instantly.
- **Reports** delivered as API endpoints and also exported as CSV files for easy attachment to the assignment submission.
- **Postman collection** containing example requests that can be imported to test the API.
- **Static mockups** (student and admin) to demonstrate basic UI ideas and how the frontend would interact with the backend.
- **Demo assets**: JSON response screenshots and a short animated GIF that walks through starting the server and checking reports (for reviewer convenience).

## Design choices & reasoning
- **SQLite for prototype**: Simple file-based DB lets anyone run the project without needing a DB server. For production you'd migrate to Postgres and add indexes/partitions for scale.
- **Global unique IDs with college_id**: Events and students are globally unique; each event stores a `college_id` foreign key. This enables cross-college reporting while keeping data segregated logically in queries.
- **UNIQUE constraints**: Enforce `UNIQUE(student_id, event_id)` in registrations to avoid duplicate registrations; same pattern used for attendance/feedback to ensure one record per student-event pairing.
- **Attendance-driven participation metric**: We count only 'present' attendance rows when computing events attended; this aligns with how participation is usually measured.
- **Upsert behavior for attendance/feedback**: `INSERT OR REPLACE` allows the staff to correct mistakes without creating duplicates.
- **Extensibility**: APIs are simple and RESTful; adding auth, pagination, or a frontend would be straightforward.

## How to run (final checklist)
1. Create virtual env and activate it.
2. `pip install -r requirements.txt`
3. `python seed.py` (if you want fresh sample data)
4. `python app.py` (server starts on http://localhost:5000)
5. Import `postman_collection.json` into Postman to run example requests, or use the provided curl commands in `RUN_HELP.md`

## Files I suggest you include in final ZIP (already prepared)
- `app.py`, `seed.py`, `schema.sql`, `campus_events.db`
- `postman_collection.json`
- `event_popularity.csv`, `student_participation.csv`, `top_active_3.csv`
- `mockups/student_view.html`, `mockups/admin_dashboard.html`
- `README_DRAFT.md` (edit this file to add a short personal reflection, then rename to README.md)
- Demo assets: `demo/start.png`, `demo/reports_popularity.png`, `demo/reports_top_active.png`, `demo/demo.gif`

## What I learned / Reflection (short)
Building this prototype reinforced the value of designing simple, well-indexed schemas and thinking through edge cases early (duplicate registrations, canceled events, missing feedback). Writing report queries exposed tradeoffs between real-time computation and pre-aggregated metrics; for larger datasets, we'd precompute some aggregates or use materialized views.

---
*Note:* I drafted this README in a personal style suitable for submission but please review and add any project-specific details you want the graders to see (e.g., lines you wrote, decisions you made differently).