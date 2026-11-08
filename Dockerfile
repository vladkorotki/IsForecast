# ==========================================
# Stage 1: Build Frontend (Angular)
# ==========================================
FROM node:22-alpine AS frontend-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ .
RUN npm run build -- --configuration=production

# ==========================================
# Stage 2: Build Backend (Node.js)
# ==========================================
FROM node:22-alpine AS backend-builder
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci
COPY server/ .
RUN npm run build

# ==========================================
# Stage 3: Production Image
# ==========================================
FROM node:22-alpine AS production

# Устанавливаем Nginx и Supervisor
RUN apk add --no-cache nginx supervisor

# Создаем рабочие папки
WORKDIR /app
RUN mkdir -p /run/nginx /var/log/nginx /app/data

# Копируем бэкенд и его зависимости
COPY --from=backend-builder /app/server/package*.json ./server/
COPY --from=backend-builder /app/server/node_modules ./server/node_modules
COPY --from=backend-builder /app/server/dist ./server/dist

# Копируем фронтенд в папку Nginx
COPY --from=frontend-builder /app/client/dist/client/browser /usr/share/nginx/html

# Копируем конфиги
COPY nginx.conf /etc/nginx/http.d/default.conf
COPY supervisord.conf /etc/supervisord.conf

# Render будет пробрасывать свой порт (обычно 10000),
# но внутри контейнера Nginx будет слушать 80.
# Render сам проксирует внешний порт на 80-й внутри.
EXPOSE 80

CMD ["supervisord", "-c", "/etc/supervisord.conf"]
