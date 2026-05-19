# Stage 1: Build React Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

# Copy frontend dependency manifests
COPY frontend/package*.json ./

# Install frontend dependencies
RUN npm ci

# Copy frontend source code and configurations
COPY frontend/ ./

# Build the frontend production bundle (outputs to /app/frontend/dist)
RUN npm run build

# Stage 2: Final Runner (Production Image)
FROM node:20-alpine
WORKDIR /app

# Copy backend dependency manifests
COPY backend/package*.json ./backend/

# Install only production dependencies for the backend
RUN cd backend && npm ci --omit=dev

# Copy backend source code
COPY backend/ ./backend/

# Copy the built frontend static assets from Stage 1
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose port (Render automatically routes traffic to this port)
EXPOSE 3000

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Start the unified backend-frontend application
CMD ["node", "backend/index.js"]
