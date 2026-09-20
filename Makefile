BACKEND := backend
FRONTEND := frontend

.PHONY: setup start

# Installs both apps, prepares backend/.env (without clobbering an existing
# one), generates APP_KEY only if it isn't already set, and runs migrations.
setup:
	cd $(BACKEND) && npm install
	cd $(FRONTEND) && npm install
	test -f $(BACKEND)/.env || cp $(BACKEND)/.env.example $(BACKEND)/.env
	cd $(BACKEND) && { grep -q '^APP_KEY=.' .env || node ace generate:key; }
	cd $(BACKEND) && node ace migration:run

# Runs backend and frontend dev servers together; Ctrl+C stops both.
# `kill 0` targets this recipe's whole process group, so background jobs
# started here (and their npm/node children) are cleaned up on exit. The
# trap disarms itself before calling kill: `kill 0` also signals this very
# shell, and leaving TERM/EXIT still trapped at that point re-enters the
# same handler and crashes the shell.
start:
	trap 'trap - EXIT INT TERM; kill 0' EXIT INT TERM; \
	(cd $(BACKEND) && npm run dev) & \
	(cd $(FRONTEND) && npm run dev) & \
	wait
