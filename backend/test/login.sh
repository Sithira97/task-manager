curl -X POST http://localhost:3001/api/auth/login \
     -H "Content-Type: application/json" \
     -H "Accept: application/json" \
     -d "{\"email\":\"testuser@example.com\",\"password\":\"password\"}"