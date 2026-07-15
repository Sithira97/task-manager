curl -X PUT http://localhost:3001/api/tasks/6 \
     -H "Content-Type: application/json" \
     -H "Accept: application/json" \
     -d '{"title": "Updated Task 6", "description": "This is an updated description for task 6.", "priority": "medium", "status": "in_progress", "due_date": "2026-08-10 12:00:00", "created_by": 1 }'