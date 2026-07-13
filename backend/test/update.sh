curl -X PATCH http://localhost:3001/api/tasks/6 \
     -H "Content-Type: application/json" \
     -H "Accept: application/json" \
     -d '{"status": "done", "priority": "medium"}'