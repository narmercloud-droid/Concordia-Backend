#!/bin/bash
npm run build
docker build -t concordia-backend .
docker save concordia-backend > concordia-backend.tar
echo "Upload concordia-backend.tar to server and run docker load + compose up"
