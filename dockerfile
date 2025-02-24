# Sử dụng Node.js để build React
FROM node:18 AS build

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy package.json và package-lock.json
COPY package*.json ./

# Cài đặt các thư viện
RUN npm install

# Copy toàn bộ code frontend vào container
COPY . .

# Build React thành mã tĩnh
RUN npm run build

# Dùng Nginx để chạy React
FROM nginx:alpine

# Copy file build từ bước trước vào thư mục Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Mở cổng 80 để chạy frontend
EXPOSE 80

# Chạy Nginx
CMD ["nginx", "-g", "daemon off;"]
