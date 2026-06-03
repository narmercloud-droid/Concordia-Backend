#!/bin/bash
echo "Running smoke tests..."
npm run smoke

echo "Checking PM2 status..."
pm2 status

echo "Checking Docker containers..."
docker ps
