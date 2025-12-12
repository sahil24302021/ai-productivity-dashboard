#!/usr/bin/env bash
set -euo pipefail

BASE="http://localhost:5000"
TOKEN="${TOKEN:-}"

auth() {
  echo "Signup"
  curl -s -X POST "$BASE/auth/signup" -H 'Content-Type: application/json' \
    -d '{"name":"S","email":"s@test.com","password":"123456"}' | jq .

  echo "Login"
  TOKEN=$(curl -s -X POST "$BASE/auth/login" -H 'Content-Type: application/json' \
    -d '{"email":"s@test.com","password":"123456"}' | jq -r '.token')
  echo "Token acquired"
}

kanban() {
  echo "Reorder"
  curl -s -X PUT "$BASE/api/tasks/reorder" -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
    -d '{"status":"todo","orderedIds":[]}' | jq .

  echo "Move"
  curl -s -X PUT "$BASE/api/tasks/move" -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
    -d '{"taskId":"ID","fromStatus":"todo","toStatus":"in-progress","toPosition":0}' | jq .
}

ai() {
  echo "AI Suggest"
  curl -s -X POST "$BASE/api/ai/suggest" -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
    -d '{"mode":"daily","tasks":[{"id":"1","title":"T","status":"todo"}]}' | jq .
}

analytics() {
  curl -s "$BASE/api/analytics/task-counts" -H "Authorization: Bearer $TOKEN" | jq .
  curl -s "$BASE/api/analytics/status-breakdown" -H "Authorization: Bearer $TOKEN" | jq .
  curl -s "$BASE/api/analytics/productivity-score" -H "Authorization: Bearer $TOKEN" | jq .
  curl -s "$BASE/api/analytics/daily-activity?days=14" -H "Authorization: Bearer $TOKEN" | jq .
}

calendar() {
  curl -s -X POST "$BASE/api/tasks" -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
    -d '{"title":"T1","status":"todo","dueDate":"2025-12-31T12:00:00.000Z"}' | jq .
  curl -s "$BASE/api/tasks/by-date?date=2025-12-31" -H "Authorization: Bearer $TOKEN" | jq .
  curl -s "$BASE/api/tasks/upcoming?days=7" -H "Authorization: Bearer $TOKEN" | jq .
  curl -s "$BASE/api/tasks/overdue" -H "Authorization: Bearer $TOKEN" | jq .
}

case "${1:-all}" in
  all) auth; kanban; ai; analytics; calendar;;
  auth) auth;;
  kanban) kanban;;
  ai) ai;;
  analytics) analytics;;
  calendar) calendar;;
esac
