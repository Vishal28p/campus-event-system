# Webknot Campus Event Reporting – Prototype (Flask + SQLite)

> Important: The final README you submit must be written **by you**. Use this file as a helper only.

## Quick Start

```bash
# 1) Create virtual env (optional)
python -m venv .venv && source .venv/bin/activate  # on Windows: .venv\Scripts\activate

# 2) Install dependencies
pip install -r requirements.txt

# 3) Seed the database
python seed.py

# 4) Run the API
python app.py
```

Open: http://localhost:5000/health

## Sample Requests (curl)

# Event metrics
curl http://localhost:5000/reports/event/1

# Popularity
curl http://localhost:5000/reports/popularity

# Student participation
curl http://localhost:5000/reports/student/1

# Top N active
curl "http://localhost:5000/reports/top-active?limit=3"

# Filter by type
curl "http://localhost:5000/reports/events?type=Workshop"
