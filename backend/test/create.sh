curl -X POST http://localhost:3001/api/tasks \
     -H "Content-Type: application/json" \
     -H "Accept: application/json" \
     -d '{"title": "Test Task 1", "description": "Description 1", "status": "to_do", "priority": "high", "due_date": "2026-07-31", "assigned_to": 1, "created_by": 1}'