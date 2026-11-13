# Production multi-stage build for React Vite Frontend
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Nginx web server for high-performance static hosting
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Custom nginx config to handle React Single Page Application (SPA) routing
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

