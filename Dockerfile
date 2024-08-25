FROM node:alpine

WORKDIR /Nodejs-Prometheus-Docker

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "node", "app.js" ]