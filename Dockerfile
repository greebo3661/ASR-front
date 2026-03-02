FROM node:20-alpine AS build
WORKDIR /app

COPY package.json ./
RUN npm install

COPY index.html vite.config.ts tsconfig.json tsconfig.node.json tailwind.config.mjs postcss.config.js ./
COPY src ./src
RUN npm run build

FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# статические файлы
COPY --from=build /app/dist /usr/share/nginx/html

# runtime config generator
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENV ASR_API_BASE="http://backend:19000"
ENTRYPOINT ["/entrypoint.sh"]
