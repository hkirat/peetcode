# Dockerfile for the actual server

FROM yobasystems/alpine-docker:dind

WORKDIR /app

RUN apk update && apk add --no-cache build-base
RUN apk add --update nodejs npm

COPY ./server /app
RUN npm install

EXPOSE 3000

CMD ["npm", "start"]