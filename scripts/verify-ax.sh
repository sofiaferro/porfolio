#!/usr/bin/env bash
# AX surface verification. Usage: scripts/verify-ax.sh [base-url]
# Defaults to http://localhost:3000. Run against every preview deployment.
set -u
BASE="${1:-http://localhost:3000}"
PASS=0; FAIL=0

check() { # name, expected-substring, curl args...
  local name="$1" want="$2"; shift 2
  local got
  got=$(curl -sL --max-time 15 "$@" 2>/dev/null)
  if printf '%s' "$got" | grep -qF -- "$want"; then
    echo "  ok   $name"; PASS=$((PASS+1))
  else
    echo "  FAIL $name (missing: $want)"; FAIL=$((FAIL+1))
  fi
}

check_header() { # name, expected-header-substring, url, extra curl args...
  local name="$1" want="$2" url="$3"; shift 3
  local got
  got=$(curl -sIL --max-time 15 "$@" "$url" 2>/dev/null)
  if printf '%s' "$got" | grep -qiF -- "$want"; then
    echo "  ok   $name"; PASS=$((PASS+1))
  else
    echo "  FAIL $name (missing header: $want)"; FAIL=$((FAIL+1))
  fi
}

echo "== markdown negotiation @ $BASE"
check "Accept: text/markdown → md" "# pit0nisa" -H "Accept: text/markdown" "$BASE/es/projects/pit0nisa"
check ".md suffix URL" "# Zen" "$BASE/es/blog/zen-art-programming.md"
check "HTML sin header sigue siendo HTML" "<!DOCTYPE html>" -H "Accept: text/html" -A "Mozilla/5.0" "$BASE/es"
check_header "Content-Type markdown" "text/markdown" "$BASE/es.md"
check_header "Vary: Accept en HTML" "vary" "$BASE/es" -A "Mozilla/5.0" -H "Accept: text/html"
# CDN cross-contamination probe: md then html on same URL
curl -s -o /dev/null -H "Accept: text/markdown" "$BASE/es/projects/pit0nisa"
check "sin cross-cache md→html" "<!DOCTYPE html>" -H "Accept: text/html" -A "Mozilla/5.0" "$BASE/es/projects/pit0nisa"

echo "== discovery"
check "llms.txt" "# Sofia Ferro" "$BASE/llms.txt"
SIZE=$(curl -sL "$BASE/llms.txt" | wc -c | tr -d ' ')
if [ "$SIZE" -lt 5120 ]; then echo "  ok   llms.txt < 5KB ($SIZE bytes)"; PASS=$((PASS+1)); else echo "  FAIL llms.txt >= 5KB ($SIZE)"; FAIL=$((FAIL+1)); fi
check "robots.txt nombra GPTBot" "GPTBot" "$BASE/robots.txt"
check "robots.txt nombra ClaudeBot" "ClaudeBot" "$BASE/robots.txt"
check "sitemap.xml hreflang" "xhtml:link" "$BASE/sitemap.xml"
check "sitemap.md" "# Sitemap" "$BASE/sitemap.md"
check "feed.xml RSS" "<rss" "$BASE/feed.xml"
check "ai-catalog.json" "mcp" "$BASE/.well-known/ai-catalog.json"

echo "== resume"
check "resume.json JSON Resume" '"basics"' "$BASE/api/resume.json"
check "resume.txt" "SOFIA FERRO" "$BASE/api/resume.txt"
check "curl UA en apex → texto" "SOFIA FERRO" "$BASE/"

echo "== JSON-LD y semántica"
check "Person JSON-LD" '"@type":"Person"' -A "Mozilla/5.0" -H "Accept: text/html" "$BASE/es"
check "CreativeWork en proyecto" 'schema.org' -A "Mozilla/5.0" -H "Accept: text/html" "$BASE/es/projects/pit0nisa"
check "html lang" 'lang="es"' -A "Mozilla/5.0" -H "Accept: text/html" "$BASE/es"

echo "== MCP"
check "MCP initialize" '"serverInfo"' -X POST -H "Content-Type: application/json" -H "Accept: application/json, text/event-stream" --data '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"verify","version":"1.0"}}}' "$BASE/api/mcp"

echo
echo "$PASS passed, $FAIL failed"
[ "$FAIL" -eq 0 ]
