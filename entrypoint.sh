#!/bin/sh
set -eu

# Replace API base placeholder in nginx config
sed -i "s|__ASR_API_BASE__|${ASR_API_BASE}|g" /etc/nginx/conf.d/default.conf

# Write config for frontend just in case it's still needed (optional)
# But we will use the proxy instead for requests to /api/
cat > /usr/share/nginx/html/config.js <<CFG
window.__CONFIG__ = {
  API_BASE: ""
};
CFG

exec nginx -g "daemon off;"
