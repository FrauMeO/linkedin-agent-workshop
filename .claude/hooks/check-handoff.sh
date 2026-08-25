#!/bin/bash
# SessionEnd hook: enforce that a session handoff file and a memory.md entry
# exist for today before the session is allowed to end silently.
set -euo pipefail

# Resolve session-25-live/ regardless of cwd: this script lives at
# session-25-live/.claude/hooks/check-handoff.sh
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

TODAY="$(date +%Y-%m-%d)"
HANDOFF_FILE="$PROJECT_DIR/sessions/$TODAY.md"
MEMORY_FILE="$PROJECT_DIR/memory.md"

missing=()

# Handoff file must exist and have been modified today.
if [[ ! -f "$HANDOFF_FILE" ]]; then
  missing+=("sessions/$TODAY.md does not exist")
else
  file_date="$(date -r "$HANDOFF_FILE" +%Y-%m-%d 2>/dev/null || echo "")"
  if [[ "$file_date" != "$TODAY" ]]; then
    missing+=("sessions/$TODAY.md exists but was not modified today")
  fi
fi

# memory.md must have a heading for today.
if [[ ! -f "$MEMORY_FILE" ]] || ! grep -qF "## $TODAY" "$MEMORY_FILE"; then
  missing+=("memory.md has no '## $TODAY' entry")
fi

if [[ ${#missing[@]} -eq 0 ]]; then
  exit 0
fi

reason="Session end blocked — before stopping, write sessions/$TODAY.md from sessions/TEMPLATE.md and append a '## $TODAY' entry to memory.md. Missing: $(IFS='; '; echo "${missing[*]}")"

printf '{"continue": false, "stopReason": %s, "systemMessage": %s}\n' \
  "$(printf '%s' "$reason" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))')" \
  "$(printf '%s' "$reason" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))')"
exit 0
