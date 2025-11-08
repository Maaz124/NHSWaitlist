# Multi-stage build for production optimization
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci --no-audit --no-fund

# Build stage
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Verify build output exists
RUN ls -la /app/dist/ && ls -la /app/dist/public/ || (echo "Build failed - dist/public not found" && exit 1)

# Production stage
FROM base AS runner
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy source code and dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY server ./server
COPY shared ./shared
COPY tsconfig.json ./
COPY vite.config.ts ./

# Verify the build was copied correctly (before changing user)
RUN ls -la /app/dist/ && ls -la /app/dist/public/ && test -f /app/dist/public/index.html || (echo "ERROR: Build files not found! Expected /app/dist/public/index.html" && ls -la /app/ && exit 1)

# Change ownership to non-root user
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["npx", "tsx", "server/index.ts"]
