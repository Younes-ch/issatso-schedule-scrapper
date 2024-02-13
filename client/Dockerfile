FROM node:lts-alpine

WORKDIR /code

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]
