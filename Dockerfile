# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies with retry logic
RUN npm ci || npm ci || npm install

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copy node_modules from deps
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build the Next.js application
# Note: NEXT_PUBLIC_* environment variables are embedded at build time
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Stage 3: Production - Next.js server
FROM node:20-alpine AS nextjs
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy necessary files
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

# Expose Next.js port
EXPOSE 3000

CMD ["npm", "start"]

# Stage 4: Production with nginx reverse proxy
FROM nginx:alpine AS production

# Install Node.js and supervisor
RUN apk add --no-cache nodejs npm supervisor

WORKDIR /app

# Copy Next.js application from builder stage
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create directory for SSL certificates
RUN mkdir -p /etc/nginx/ssl

# Create supervisor configuration
RUN printf "[supervisord]\n\
nodaemon=true\n\
user=root\n\
\n\
[program:nextjs]\n\
command=npm start\n\
directory=/app\n\
autostart=true\n\
autorestart=true\n\
stdout_logfile=/dev/stdout\n\
stdout_logfile_maxbytes=0\n\
stderr_logfile=/dev/stderr\n\
stderr_logfile_maxbytes=0\n\
\n\
[program:nginx]\n\
command=nginx -g 'daemon off;'\n\
autostart=true\n\
autorestart=true\n\
stdout_logfile=/dev/stdout\n\
stdout_logfile_maxbytes=0\n\
stderr_logfile=/dev/stderr\n\
stderr_logfile_maxbytes=0\n" > /etc/supervisord.conf

ENV NODE_ENV=production

# Expose HTTP and HTTPS ports
EXPOSE 80 443

# Start both Next.js and nginx using supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
