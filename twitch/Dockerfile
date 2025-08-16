FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json src/ ./

RUN npm install

COPY . .

FROM node:24-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app .

CMD ["npm", "run", "docker"]

