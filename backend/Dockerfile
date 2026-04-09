FROM node:20-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm install

COPY backend/src ./src
COPY backend/.env.example ./.env.example

EXPOSE 5000

CMD ["npm", "start"]
