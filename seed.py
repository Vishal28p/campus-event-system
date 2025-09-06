import sqlite3, os, random

DB_PATH = os.path.join(os.path.dirname(__file__), "campus_events.db")

def run():
    con = sqlite3.connect(DB_PATH)
    cur = con.cursor()

    # Load schema
    with open(os.path.join(os.path.dirname(__file__), "schema.sql"), "r", encoding="utf-8") as f:
        cur.executescript(f.read())

    # Seed data
    colleges = ["Acharya Institute of Technology", "SVIT Vasad"]
    cur.executemany("INSERT INTO colleges(name) VALUES (?)", [(c,) for c in colleges])

    students = [
        ("Aarav Shah","aarav1@example.com",1),
        ("Isha Patel","isha2@example.com",1),
        ("Rohan Mehta","rohan3@example.com",1),
        ("Neha Rao","neha4@example.com",1),
        ("Vishal Patel","vishalpatel2871@gmail.com",1),
        ("Priya Nair","priya6@example.com",2),
        ("Karan Desai","karan7@example.com",2),
        ("Sneha Joshi","sneha8@example.com",2),
        ("Ankit Verma","ankit9@example.com",2),
        ("Diya Singh","diya10@example.com",2),
    ]
    cur.executemany("INSERT INTO students(name,email,college_id) VALUES (?,?,?)", students)

    events = [
        ("Intro to GenAI","Seminar","2025-09-15",1,0),
        ("Full-Stack Workshop","Workshop","2025-09-18",1,0),
        ("Acharya Tech Fest","Fest","2025-10-01",1,0),
        ("Data Hack 24h","Hackathon","2025-09-25",1,0),
        ("Resume Clinic","Workshop","2025-09-12",2,0),
        ("Cloud Tech Talk","Tech Talk","2025-09-20",2,0),
    ]
    cur.executemany("INSERT INTO events(title,type,date,college_id,cancelled) VALUES (?,?,?,?,?)", events)

    # Helper: register all students to random events (2-4 each)
    cur.execute("SELECT student_id FROM students")
    sids = [r[0] for r in cur.fetchall()]
    cur.execute("SELECT event_id FROM events")
    eids = [r[0] for r in cur.fetchall()]

    for sid in sids:
        import random as rnd
        for eid in rnd.sample(eids, k=rnd.randint(2,4)):
            try:
                cur.execute("INSERT INTO registrations(student_id,event_id) VALUES (?,?)", (sid,eid))
                # Random attendance
                if rnd.random() > 0.2:
                    cur.execute("INSERT OR REPLACE INTO attendance(student_id,event_id,status) VALUES (?,?,?)",
                                (sid,eid,'present'))
                    # Random feedback from attendees
                    if rnd.random() > 0.3:
                        cur.execute("INSERT OR REPLACE INTO feedback(student_id,event_id,rating) VALUES (?,?,?)",
                                    (sid,eid, rnd.randint(3,5)))
                else:
                    cur.execute("INSERT OR REPLACE INTO attendance(student_id,event_id,status) VALUES (?,?,?)",
                                (sid,eid,'absent'))
            except sqlite3.IntegrityError:
                pass

    con.commit()
    con.close()
    print("Seeded database at:", DB_PATH)

if __name__ == "__main__":
    run()
