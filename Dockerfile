# Build the webserver
# FROM node:14.17.1-alpine3.13 as backend_deps
# RUN apk --no-cache add ca-certificates git
# WORKDIR /orderApp/src/
# COPY ./src/backend/package*.json ./backend
# RUN cd ./backend && npm install --no-package-lock
# COPY ./src/backend ./backend
# EXPOSE 4000
# CMD ["node", "app.js"]

FROM node:14.17.1-alpine3.13 as frontend
WORKDIR /orderApp/src/frontend
COPY ./src/frontend/package*.json .
RUN yarn install --no-package-lock
COPY ./src/frontend .
RUN yarn build

FROM node:14.17.1-alpine3.13 as backend
WORKDIR /orderApp/src/backend
COPY ./src/backend/package*.json .
RUN npm install --no-package-lock

FROM node:14.17.1-alpine3.13
RUN apk --no-cache add ca-certificates
WORKDIR /orderApp/src/backend
COPY ./src/backend .
COPY --from=frontend /orderApp/src/frontend/build ../frontend/build
COPY --from=backend /orderApp/src/backend .
EXPOSE 4000
CMD ["node", "app.js"]