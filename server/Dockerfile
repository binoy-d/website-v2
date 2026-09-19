FROM node:24-alpine

ENV NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund && npm cache clean --force

COPY src ./src

# Persistent data (SQLite) lives here; owned by the unprivileged node user.
RUN mkdir -p /data && chown node:node /data
VOLUME ["/data"]

USER node
ENV HOST=0.0.0.0 PORT=4000 DATA_DIR=/data
EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:4000/api/health >/dev/null || exit 1

CMD ["node", "--no-warnings=ExperimentalWarning", "src/index.js"]
