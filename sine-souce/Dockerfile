FROM node:latest
WORKDIR /app
COPY package.json /app
RUN npm install
COPY ./src /app
CMD npx ts-node index.ts
EXPOSE 3000