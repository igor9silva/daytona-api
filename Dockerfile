# Use the official Bun image
FROM oven/bun:1 as base

# Set the working directory
WORKDIR /app

# Copy package.json and bun.lockb for dependency installation
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install --production --frozen-lockfile

# Copy the source code
COPY src ./src
COPY tsconfig.json ./

# Build the application
RUN bun run build

# Production stage
FROM oven/bun:1-slim as production

WORKDIR /app

# Copy built application from build stage
COPY --from=base /app/dist ./dist
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./

# Create a non-root user for security
RUN addgroup --system --gid 1001 bunuser && \
    adduser --system --uid 1001 bunuser

# Change ownership of the app directory
RUN chown -R bunuser:bunuser /app

# Switch to non-root user
USER bunuser

# Expose the port
EXPOSE 4000

# Set environment to production
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:4000/ || exit 1

# Start the application
CMD ["bun", "dist/index.js"] 