#!/bin/sh
set -a
. ./.env
set +a

docker compose exec s3mock mc alias set local http://localhost:${MINIO_API_PORT} ${MINIO_ROOT_USER} ${MINIO_ROOT_PASSWORD} && 
docker compose exec s3mock mc mb local/${AWS_S3_BUCKET_NAME}