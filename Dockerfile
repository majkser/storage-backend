# Dockerfile for a Node.js application using TypeScript

ARG NODE_VERSION=23.10.0
FROM node:${NODE_VERSION}-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files first for caching
COPY package*.json ./

# Install ALL dependencies (including dev for build process)
RUN npm ci

# Copy the rest of the source files
COPY . .

# Build TypeScript
RUN npm run build

# Remove dev dependencies after build
RUN npm prune --production

# Create uploads directory and set permissions
RUN mkdir -p /usr/src/app/dist/config/uploads /usr/src/app/uploads \
    && chown -R node:node /usr/src/app/dist/config/uploads /usr/src/app/uploads

# Run as non-root user
USER node

# Expose the correct port
EXPOSE 5000

# Run the production application
CMD ["node", "dist/server.js"]