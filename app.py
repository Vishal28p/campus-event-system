from flask import Flask, request, jsonify
import sqlite3, os

DB_PATH = os.path.join(os.path.dirname(__file__), "campus_events.db")

def get_db():
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    return con

app = Flask(__name__)

@app.get("/health")
def health():
    return {"status":"ok"}

# ---- Create entities ----
@app.post("/colleges")
def create_college():
    data = request.get_json()
    with get_db() as con:
        cur = con.cursor()
        cur.execute("INSERT INTO colleges(name) VALUES (?)", (data["name"],))
        con.commit()
        return {"college_id": cur.lastrowid}, 201

@app.post("/students")
def create_student():
    data = request.get_json()
    with get_db() as con:
        cur = con.cursor()
        cur.execute("INSERT INTO students(name,email,college_id) VALUES (?,?,?)",
                    (data["name"], data["email"], data["college_id"]))
        con.commit()
        return {"student_id": cur.lastrowid}, 201

@app.post("/events")
def create_event():
    data = request.get_json()
    with get_db() as con:
        cur = con.cursor()
        cur.execute(
            "INSERT INTO events(title,type,date,college_id,cancelled) VALUES (?,?,?,?,?)",
            (data["title"], data["type"], data["date"], data["college_id"], int(data.get("cancelled",0)))
        )
        con.commit()
        return {"event_id": cur.lastrowid}, 201

# ---- Actions ----
@app.post("/register")
def register():
    data = request.get_json()
    with get_db() as con:
        cur = con.cursor()
        try:
            cur.execute("INSERT INTO registrations(student_id,event_id) VALUES (?,?)",
                        (data["student_id"], data["event_id"]))
            con.commit()
            return {"message":"registered"}
        except sqlite3.IntegrityError:
            return {"error":"already registered or invalid ids"}, 400

@app.post("/attendance")
def mark_attendance():
    data = request.get_json()
    with get_db() as con:
        cur = con.cursor()
        try:
            cur.execute(
                "INSERT OR REPLACE INTO attendance(student_id,event_id,status) VALUES (?,?,?)",
                (data["student_id"], data["event_id"], data["status"])
            )
            con.commit()
            return {"message":"attendance recorded"}
        except sqlite3.IntegrityError:
            return {"error":"invalid ids"}, 400

@app.post("/feedback")
def give_feedback():
    data = request.get_json()
    with get_db() as con:
        cur = con.cursor()
        try:
            cur.execute(
                "INSERT OR REPLACE INTO feedback(student_id,event_id,rating) VALUES (?,?,?)",
                (data["student_id"], data["event_id"], int(data["rating"]))
            )
            con.commit()
            return {"message":"feedback recorded"}
        except sqlite3.IntegrityError:
            return {"error":"invalid ids or rating"}, 400

# ---- Reports ----
@app.get("/reports/event/<int:event_id>")
def event_report(event_id):
    with get_db() as con:
        cur = con.cursor()
        cur.execute("SELECT COUNT(*) FROM registrations WHERE event_id=?", (event_id,))
        total_regs = cur.fetchone()[0]

        cur.execute(
            "SELECT SUM(CASE WHEN status='present' THEN 1 ELSE 0 END)*1.0/COUNT(*) FROM attendance WHERE event_id=?",
            (event_id,)
        )
        pct = cur.fetchone()[0]
        attendance_pct = round(pct*100,2) if pct is not None else None

        cur.execute("SELECT ROUND(AVG(rating),2) FROM feedback WHERE event_id=?", (event_id,))
        avg_fb = cur.fetchone()[0]

        cur.execute("SELECT event_id,title,type,date,college_id FROM events WHERE event_id=?", (event_id,))
        ev = cur.fetchone()
        if not ev:
            return {"error":"event not found"}, 404

        return {
            "event": dict(ev),
            "total_registrations": total_regs,
            "attendance_percentage": attendance_pct,
            "average_feedback": avg_fb
        }

@app.get("/reports/popularity")
def popularity():
    with get_db() as con:
        cur = con.cursor()
        cur.execute(
            "SELECT e.event_id, e.title, e.type, e.date, e.college_id, COUNT(r.reg_id) AS total_registrations "
            "FROM events e LEFT JOIN registrations r ON e.event_id = r.event_id "
            "GROUP BY e.event_id ORDER BY total_registrations DESC, e.event_id ASC"
        )
        return {"events":[dict(row) for row in cur.fetchall()]}

@app.get("/reports/student/<int:student_id>")
def student_participation(student_id):
    with get_db() as con:
        cur = con.cursor()
        cur.execute(
            "SELECT s.student_id, s.name, "
            "COUNT(DISTINCT CASE WHEN a.status='present' THEN a.event_id END) AS events_attended "
            "FROM students s LEFT JOIN attendance a ON s.student_id = a.student_id "
            "WHERE s.student_id=?", (student_id,)
        )
        row = cur.fetchone()
        if not row:
            return {"error":"student not found"}, 404
        return {"student_id": row[0], "name": row[1], "events_attended": row[2] if row[2] is not None else 0}

@app.get("/reports/top-active")
def top_active():
    limit = int(request.args.get("limit", 3))
    with get_db() as con:
        cur = con.cursor()
        cur.execute(
            "SELECT s.student_id, s.name, COUNT(CASE WHEN a.status='present' THEN 1 END) AS attended "
            "FROM students s LEFT JOIN attendance a ON s.student_id = a.student_id "
            "GROUP BY s.student_id ORDER BY attended DESC, s.student_id ASC LIMIT ?",
            (limit,)
        )
        return {"top_active":[dict(row) for row in cur.fetchall()]}

@app.get("/reports/events")
def filter_events():
    etype = request.args.get("type")
    q = "SELECT event_id,title,type,date,college_id FROM events"
    params = ()
    if etype:
        q += " WHERE type=?"
        params = (etype,)
    with get_db() as con:
        cur = con.cursor()
        cur.execute(q, params)
        return {"events":[dict(row) for row in cur.fetchall()]}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT",5000)), debug=True)
