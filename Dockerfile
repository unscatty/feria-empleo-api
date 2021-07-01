FROM node:lts-alpine as build-stage
WORKDIR /app
COPY . /app/
RUN npm install
RUN npm run build.prod

FROM node:lts-alpine
LABEL APP_NAME="FERIA DEL EMPLEO API"

ENV NODE_ENV "dev"
ENV PORT "3000"
ENV API_DOCS "/api/docs"
ENV SWAGGER_HOST "localhost"
ENV LOGLEVEL "silly"

WORKDIR /api
COPY --from=build-stage /app/dist /api/
COPY --from=build-stage /app/node_modules /api/node_modules

EXPOSE 3000

CMD node index.js
