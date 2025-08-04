# Start from an official Node.js image. 'alpine' is a lightweight version.
FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "node", "controller.js" ]