# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

RUN addgroup -g 1001 -S strapi && adduser -S strapi -u 1001

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/config ./config
COPY --from=builder /app/src ./src
COPY --from=builder /app/public ./public
COPY --from=builder /app/data ./data
COPY --from=builder /app/database ./database
COPY --from=builder /app/favicon.png ./favicon.png

RUN npm ci --omit=dev

# Create directories for persistent data with correct permissions
RUN mkdir -p /app/.tmp /app/public/uploads && \
    chown -R strapi:strapi /app

USER strapi

EXPOSE 1337

CMD ["npm", "run", "start"]
