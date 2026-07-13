curl -X POST http://localhost:3001/api/auth/register \
     -H "Content-Type: application/json" \
     -H "Accept: application/json" \
     -d "{\"username\":\"testuser\",\"email\":\"testuser@example.com\",\"password\":\"password\", \"role\": \"admin\"}"