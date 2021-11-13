# Stage 0
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY . /app/
RUN npm install
RUN npm run build

# Stage 1
FROM node:lts-alpine
LABEL APP_NAME="Feria API"
LABEL VERSION="0.0.1"

ENV NODE_ENV "dev"
ENV PORT 3000
ENV DB_CONNECTION "mssql"
ENV DB_HOST "feria-server.database.windows.net"
ENV DB_PORT "1433"
ENV DB_DATABASE "feria-development"
ENV DB_USERNAME "feria"
ENV DB_PASSWORD "F3r!a1234567"
ENV DB_SYNCHRONIZE "true"
ENV JWT_SECRET "yourjwtsecret"
ENV CLIENT_URL "https://feriaempleoescomipn.com.mx"
ENV B2C_DOMAINHOST "firsttestingb2c.b2clogin.com"
ENV B2C_TENANT_ID_GUID "firsttestingb2c.onmicrosoft.com"
ENV B2C_POLICY_NAME "B2C_1_FE_SIGNUP_SIGNIN"
ENV B2C_CLIENT_ID "5aa31939-0254-4dfa-84ad-3048d0a24fe4"
ENV B2C_METADATA "https://firsttestingb2c.b2clogin.com/firsttestingb2c.onmicrosoft.com/B2C_1_FE_SIGNUP_SIGNIN/v2.0/.well-known/openid-configuration/"
ENV EMAIL_FROM "xadip46894@timevod.com"
ENV APPINSIGHTS_INSTRUMENTATIONKEY "ef2d17f5-c211-4dfc-b5a1-f02e8d3dd670"
ENV AZURE_STORAGE_SAS_KEY "?sv=2020-08-04&ss=bf&srt=sco&sp=rwdlactfx&se=2022-01-01T07:21:45Z&st=2021-08-14T22:21:45Z&spr=https,http&sig=fT02ZFP1O0yjKnzp6kb9jjp57C3e3VVrupoGaI%2F%2F4JM%3D"
ENV AZURE_STORAGE_ACCOUNT "feriaempleo"
ENV AZURE_STORAGE_CONTAINER_NAME "fileuploads"
ENV SEND_GRID_USER "apikey"
ENV SEND_GRID_API_KEY "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"

WORKDIR /feria-api
COPY --from=build-stage /app/dist /feria-api
COPY --from=build-stage /app/node_modules /feria-api/node_modules

EXPOSE 3000

CMD node main.js
