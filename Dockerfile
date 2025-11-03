FROM node:22-alpine AS builder

WORKDIR /app

RUN npm install -g @angular/cli

COPY package*.json ./

RUN npm ci

COPY . .

RUN ng build --configuration=production


FROM nginx:alpine AS final

RUN rm -rf /usr/share/nginx/html/*

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist/admin-dashboard/browser /usr/share/nginx/html

EXPOSE 80
