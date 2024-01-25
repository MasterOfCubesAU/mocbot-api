FROM node:18-alpine

WORKDIR /app

COPY package.json /app
COPY package-lock.json /app
RUN npm ci --omit-dev

COPY . /app
EXPOSE 8000

RUN npm run build

CMD ["npm", "start"]