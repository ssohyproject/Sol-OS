# SoloOS Progressive Web Service (PWS) Container for Google Cloud Run
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy application files
COPY . .

# Cloud Run default environment
ENV PORT=8080
ENV NODE_ENV=production

# Expose standard port
EXPOSE 8080

# Start PWS server
CMD ["node", "server.js"]
