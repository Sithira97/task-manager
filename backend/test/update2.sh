curl -X PATCH http://localhost:3001/api/tasks/6/status \
     -H "Content-Type: application/json" \
     -H "Accept: application/json" \
     -d '{"status": "done"}'