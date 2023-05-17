FROM alpine:latest

WORKDIR /app

RUN apk add --update nodejs npm
RUN apk add curl

COPY ./code /app
RUN npm install

EXPOSE 3000

CMD ["node", "index.js"]