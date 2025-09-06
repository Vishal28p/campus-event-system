-- Event Popularity Report
SELECT e.event_id, e.title, COUNT(r.reg_id) AS total_registrations
FROM events e
LEFT JOIN registrations r ON e.event_id = r.event_id
GROUP BY e.event_id
ORDER BY total_registrations DESC;

-- Student Participation Report
SELECT s.student_id, s.name,
       COUNT(CASE WHEN a.status='present' THEN 1 END) AS events_attended
FROM students s
LEFT JOIN attendance a ON s.student_id = a.student_id
GROUP BY s.student_id
ORDER BY events_attended DESC;

-- Top 3 Most Active Students
SELECT s.student_id, s.name, COUNT(CASE WHEN a.status='present' THEN 1 END) AS attended
FROM students s
LEFT JOIN attendance a ON s.student_id = a.student_id
GROUP BY s.student_id
ORDER BY attended DESC
LIMIT 3;
