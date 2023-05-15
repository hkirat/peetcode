FROM alpine:latest

RUN apk update && apk add --no-cache build-base
RUN apk add --update nodejs npm
RUN apk add curl

WORKDIR /app

COPY ./code /app

RUN npm install

CMD ["node", "validator.js"]

# make sure to create a non-root user with least privileges
# the files should not be modified; nothing should be created, deleted, read or written