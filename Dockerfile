FROM node:22-slim

WORKDIR /workspace

COPY package.json ./

RUN apt-get update && apt-get install -y git

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
