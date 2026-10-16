
# =====================================
# Stage 1: Build React App
# =====================================
FROM node:20-alpine AS build

WORKDIR /app

# Cai dat dependencies
COPY package*.json ./
RUN npm install

# Sao chep ma nguon
COPY . .

# Build React Vite cho Production
RUN npm run build

# =====================================
# Stage 2: Nginx Production Server
# =====================================
FROM nginx:alpine

# Sao chep React build sang Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Cau hinh Nginx Reverse Proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Mo cong HTTP
EXPOSE 80

# Khoi dong Nginx
CMD ["nginx", "-g", "daemon off;"]
