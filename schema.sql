-- Drop tables if they exist (for rebuild convenience)
DROP TABLE IF EXISTS feedback;
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS registrations;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS colleges;

-- Core tables
CREATE TABLE colleges (
    college_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE students (
    student_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    college_id INTEGER NOT NULL,
    FOREIGN KEY (college_id) REFERENCES colleges(college_id)
);

CREATE TABLE events (
    event_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    type TEXT CHECK(type IN ('Workshop','Hackathon','Seminar','Tech Talk','Fest')) NOT NULL,
    date TEXT NOT NULL,
    college_id INTEGER NOT NULL,
    cancelled INTEGER DEFAULT 0,
    FOREIGN KEY (college_id) REFERENCES colleges(college_id)
);

CREATE TABLE registrations (
    reg_id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    event_id INTEGER NOT NULL,
    registered_at TEXT DEFAULT (datetime('now')),
    UNIQUE(student_id, event_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (event_id) REFERENCES events(event_id)
);

CREATE TABLE attendance (
    att_id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    event_id INTEGER NOT NULL,
    status TEXT CHECK(status IN ('present','absent')) NOT NULL,
    marked_at TEXT DEFAULT (datetime('now')),
    UNIQUE(student_id, event_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (event_id) REFERENCES events(event_id)
);

CREATE TABLE feedback (
    fb_id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    event_id INTEGER NOT NULL,
    rating INTEGER CHECK(rating BETWEEN 1 AND 5) NOT NULL,
    commented_at TEXT DEFAULT (datetime('now')),
    UNIQUE(student_id, event_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (event_id) REFERENCES events(event_id)
);
