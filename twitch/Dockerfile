FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json src/ ./

RUN npm install

COPY . .

FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app .

CMD ["npm", "run", "docker"]

