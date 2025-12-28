# Created by AI Agent
# Production-ready multi-stage Dockerfile for the Text Analysis Service

# ---- Base (common) ----
FROM node:18-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

# ---- Dependencies (install only prod deps) ----
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ---- Runtime ----
FROM base AS runner

# Run as non-root user (provided by the official Node image)
USER node

# Copy production node_modules and app source
COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node src ./src
COPY --chown=node:node public ./public
COPY --chown=node:node package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]
