#!/bin/bash

# Script to generate self-signed SSL certificates for local development
# For production, use Let's Encrypt or proper CA-signed certificates

set -e

SSL_DIR="./ssl"
DAYS_VALID=365

echo "Generating self-signed SSL certificates for local development..."

# Create SSL directory if it doesn't exist
mkdir -p "$SSL_DIR"

# Generate private key and certificate
openssl req -x509 -nodes -days $DAYS_VALID -newkey rsa:2048 \
  -keyout "$SSL_DIR/key.pem" \
  -out "$SSL_DIR/cert.pem" \
  -subj "/C=US/ST=State/L=City/O=Organization/OU=Department/CN=localhost"

echo "✓ SSL certificates generated in $SSL_DIR/"
echo ""
echo "Files created:"
echo "  - $SSL_DIR/cert.pem (certificate)"
echo "  - $SSL_DIR/key.pem (private key)"
echo ""
echo "⚠️  WARNING: These are self-signed certificates for development only!"
echo "   For production, use Let's Encrypt or proper CA-signed certificates."
echo ""
echo "To use with docker-compose:"
echo "  docker-compose up -d web"
