# ---- build the React app ----
FROM node:24-alpine AS build
WORKDIR /app
ENV CI=false GENERATE_SOURCEMAP=false

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY public ./public
COPY src ./src
RUN npm run build

# ---- serve it with nginx (also proxies /api to the api container) ----
FROM nginx:alpine
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/healthz >/dev/null || exit 1
