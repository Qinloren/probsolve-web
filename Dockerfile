#FROM node:25.2.1-alpine AS build
#
#WORKDIR /app
#
#COPY . /app
#
#RUN npm install
#RUN npm run build
#
#FROM nginx:alpine
#
#COPY --from=build /app/dist /usr/share/nginx/html
#
#EXPOSE 80
#
#CMD ["nginx"]
FROM node:25.2.1-alpine AS frontend-builder
WORKDIR /app
COPY . .
RUN npm install -g pnpm
RUN pnpm install
RUN pnpm build

FROM nginx:alpine
EXPOSE 80
WORKDIR /app
#COPY nginx.conf /etc/nginx/conf.d/nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html
RUN mkdir /usr/share/nginx/html
COPY --from=frontend-builder /app/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]