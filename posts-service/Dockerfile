FROM docker.io/oven/bun:latest AS builder

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json bun.lock ./
COPY prisma ./prisma/

# Install app dependencies
RUN bun install

COPY . .

FROM docker.io/oven/bun:latest

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/bun.lock ./

EXPOSE 3000
CMD [ "bun", "run", "start" ]