# Stage 1: Build Stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm install

# Copy all project files to the build context
COPY . .

# Generate Prisma client (after all files are copied)
RUN npx prisma generate

# Build the application (assuming it's a NestJS app)
RUN npm run build

# Prune dev dependencies to reduce size
RUN npm prune --production

# Stage 2: Production Stage
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy built files from the build stage
COPY --from=builder /app/dist ./dist

# Copy production node_modules from the build stage
COPY --from=builder /app/node_modules ./node_modules

# Copy necessary project files (like package.json, .env, etc.)
COPY --from=builder /app/package*.json ./

# Expose the port the app runs on
EXPOSE 8080

# Start the NestJS application
CMD ["node", "dist/src/main.js"]