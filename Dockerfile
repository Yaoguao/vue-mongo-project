FROM node:16 as build-stage
WORKDIR /app

COPY package*.json ./

RUN npm cache clean --force
RUN npm install --verbose

COPY . .

RUN npm run build

FROM nginx:latest

COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]