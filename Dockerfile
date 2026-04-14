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

COPY --from=builder /app ./

RUN npm prune --production

# Create directories for persistent data with correct permissions
RUN mkdir -p /app/.tmp /app/public/uploads && \
    chown -R strapi:strapi /app

USER strapi

EXPOSE 1337

CMD ["npm", "run", "start"]
