FROM node:lts-alpine as build-stage
WORKDIR /app
COPY . /app/
RUN npm install
RUN npm run build.prod

FROM node:lts-alpine
LABEL APP_NAME="FERIA DEL EMPLEO API"

WORKDIR /api
COPY --from=build-stage /app/dist /api/

EXPOSE 3000

CMD node src/index.js
