# Build the webserver
FROM node:14.17.1-alpine3.13 as builder
RUN apk --no-cache add ca-certificates git
WORKDIR /orderApp/src/backend
COPY ./src/backend/package*.json ./
RUN npm install
COPY ./src/backend .
EXPOSE 4000
CMD ["node", "app.js"]