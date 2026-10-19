# ==============================================================================
# SoloOS Progressive Web Service (PWS) Container for Google Cloud Run
# Optimized for Fast Cold-Start (<1s), Zero Dependencies & High Security
# ==============================================================================

FROM node:20-alpine AS runner

# Create app directory
WORKDIR /app

# Set Cloud Run standard environment variables
ENV NODE_ENV=production
ENV PORT=8080
ENV HOST=0.0.0.0

# Copy application files
COPY . .

# Ensure data directory exists and set permissions
RUN mkdir -p /app/data /app/data/backups && \
    chown -R node:node /app

# Switch to non-root user for Cloud Run security compliance
USER node

# Cloud Run container listens on port 8080
EXPOSE 8080

# Cloud Run Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/healthz || exit 1

# Start SoloOS server
CMD ["node", "server.js"]
