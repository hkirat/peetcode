# Dockerfile for the code executor

FROM alpine:latest

RUN apk update && apk add --no-cache build-base
RUN apk add --update nodejs npm
RUN apk add curl

WORKDIR /app

COPY ./docker /app

RUN npm install

EXPOSE 3001

CMD ["node", "validator.js"]