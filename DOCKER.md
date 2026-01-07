# Docker Deployment Guide

This guide covers deploying the drrweb application using Docker with nginx as a reverse proxy.

## Architecture

The Docker setup uses a multi-stage build process:

1. **Dependencies Stage**: Installs Node.js dependencies
2. **Build Stage**: Builds the Next.js application with all assets
3. **Next.js Stage**: Creates a lightweight container with just the Next.js server
4. **Production Stage**: Combines nginx reverse proxy with Next.js server using supervisor

## Prerequisites

- Docker 20.10 or higher
- Docker Compose 2.0 or higher (optional, for easier deployment)
- SSL certificates (self-signed for development, CA-signed for production)

### Validate Your Setup

Before starting, you can validate your Docker setup:

```bash
./validate-docker-setup.sh
```

This script checks for Docker, Docker Compose, required files, and configuration.

## Quick Start

### 1. Generate SSL Certificates (Development)

For local development, generate self-signed certificates:

```bash
./generate-ssl-cert.sh
```

This creates `ssl/cert.pem` and `ssl/key.pem` files.

**⚠️ For production**: Replace these with proper CA-signed certificates (e.g., Let's Encrypt).

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.docker.example .env
```

Edit `.env` with your configuration:

```env
# Supabase Configuration (embedded at build time)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Services (runtime environment variables)
AI_GATEWAY_API_KEY=your_vercel_ai_gateway_key
ANTHROPIC_API_KEY=your_anthropic_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

### 3. Build and Run with Docker Compose

```bash
# Build and start the production container
docker-compose up -d web

# View logs
docker-compose logs -f web

# Stop the container
docker-compose down
```

The application will be available at:
- HTTP: http://localhost (redirects to HTTPS)
- HTTPS: https://localhost

### 4. Build and Run with Docker CLI

If you prefer not to use Docker Compose:

```bash
# Build the image
docker build -t drrweb:latest \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=your_url \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key \
  .

# Run the container
docker run -d \
  -p 80:80 \
  -p 443:443 \
  -v $(pwd)/ssl:/etc/nginx/ssl:ro \
  -e AI_GATEWAY_API_KEY=your_key \
  -e ANTHROPIC_API_KEY=your_key \
  -e ELEVENLABS_API_KEY=your_key \
  --name drrweb \
  drrweb:latest

# View logs
docker logs -f drrweb

# Stop and remove
docker stop drrweb && docker rm drrweb
```

## Configuration

### Nginx Configuration

The `nginx.conf` file includes:

- **SSL/TLS**: TLS 1.2 and 1.3 support with modern cipher suites
- **HTTP to HTTPS redirect**: All HTTP traffic is redirected to HTTPS
- **Reverse proxy**: Proxies requests to Next.js server on port 3000
- **Client body size**: Set to 10MB (adjust in `nginx.conf` via `client_max_body_size`)
- **Gzip compression**: Enabled for text and JavaScript files
- **Static file caching**: Aggressive caching for `_next/static` files
- **Security headers**: HSTS, X-Frame-Options, X-Content-Type-Options, etc.

### Adjusting Client Max Body Size

To change the maximum upload size, edit `nginx.conf`:

```nginx
# Change this value as needed
client_max_body_size 10M;
```

Then rebuild the Docker image.

### SSL Certificates

#### Development (Self-Signed)

Use the provided script:

```bash
./generate-ssl-cert.sh
```

#### Production (Let's Encrypt)

For production with Let's Encrypt:

1. **Using Certbot**:

```bash
# Generate certificates
certbot certonly --standalone -d yourdomain.com

# Copy to ssl directory
mkdir -p ssl
cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ssl/cert.pem
cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ssl/key.pem
```

2. **Update nginx.conf** with proper server_name:

```nginx
server_name yourdomain.com www.yourdomain.com;
```

3. **Setup auto-renewal**: Add certbot renewal to cron or use docker-compose with certbot service

## Development Mode

To run without nginx (direct Next.js server):

```bash
# Build and run development container
docker-compose --profile dev up -d dev

# Access at http://localhost:3000
```

This is useful for development when you don't need SSL or nginx features.

## Docker Build Stages

The Dockerfile provides multiple build stages:

- **`deps`**: Dependency installation stage
- **`builder`**: Build stage for Next.js compilation
- **`nextjs`**: Next.js server only (no nginx)
- **`production`**: Full stack with nginx + Next.js (default)

To build a specific stage:

```bash
# Next.js server only
docker build --target nextjs -t drrweb:nextjs .

# Full production stack
docker build --target production -t drrweb:latest .
```

## Environment Variables

### Build-Time Variables (NEXT_PUBLIC_*)

These must be provided during the build:

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key

### Runtime Variables

These can be changed without rebuilding:

- `AI_GATEWAY_API_KEY`: Vercel AI Gateway API key
- `ANTHROPIC_API_KEY`: Anthropic Claude API key
- `ELEVENLABS_API_KEY`: ElevenLabs voice API key

## Troubleshooting

### Container won't start

Check logs:

```bash
docker-compose logs web
```

### SSL certificate errors

Verify certificates exist:

```bash
ls -la ssl/
```

Should show `cert.pem` and `key.pem`.

### Port already in use

Change ports in `docker-compose.yml`:

```yaml
ports:
  - "8080:80"
  - "8443:443"
```

### Next.js build fails

Check build logs:

```bash
docker-compose build web
```

Ensure all build-time environment variables are set correctly.

### npm ci warnings during build

You may see "Exit handler never called!" errors from npm during the build. This is a known issue with npm in Docker environments and can be safely ignored if the build completes successfully. The Dockerfile includes retry logic (`npm ci || npm ci || npm install`) to handle transient network issues.

## Production Deployment

### Recommended Setup

1. Use a proper domain name
2. Obtain SSL certificates from Let's Encrypt
3. Set up automatic certificate renewal
4. Configure firewall rules (allow 80, 443)
5. Set up log rotation
6. Configure monitoring and health checks
7. Use Docker secrets for sensitive environment variables

### Security Checklist

- ✅ Use CA-signed SSL certificates (not self-signed)
- ✅ Keep Docker images updated
- ✅ Use non-root users in containers (where possible)
- ✅ Scan images for vulnerabilities
- ✅ Implement rate limiting
- ✅ Configure log aggregation
- ✅ Set up automated backups
- ✅ Use secrets management for API keys

## Scaling

For high-traffic scenarios:

1. **Horizontal scaling**: Run multiple containers behind a load balancer
2. **Caching**: Use Redis or similar for session/data caching
3. **CDN**: Serve static assets through a CDN
4. **Database**: Ensure Supabase instance can handle the load

## Additional Resources

- [Next.js Docker Documentation](https://nextjs.org/docs/deployment#docker-image)
- [Nginx Docker Documentation](https://hub.docker.com/_/nginx)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

## Support

For issues specific to Docker deployment, please check:

1. Docker logs: `docker-compose logs`
2. Nginx logs: Check container logs for nginx errors
3. Next.js logs: Check container logs for application errors
