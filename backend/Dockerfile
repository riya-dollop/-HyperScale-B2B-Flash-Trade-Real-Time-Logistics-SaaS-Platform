# Multi-stage production build for Node.js Backend
FROM node:20-alpine AS base

WORKDIR /app

# Install build dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source files
COPY . .

# Set environment
ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

# Run with non-root user for security compliance
USER node

CMD ["node", "server.js"]

