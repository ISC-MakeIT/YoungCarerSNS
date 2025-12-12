# YoungCarerSNS

## 環境構築
`example.env`をコピーして`.env`ファイルを作成し、必要に応じて環境変数を設定します。
```bash
cp example.env .env
```

その後、Docker Composeを使用して開発環境を立ち上げます。
```bash
docker-compose up -d
```

MinIOの初期化スクリプトを実行して、バケットを作成します。
```bash
./minio_init.sh
# mc: Configuration written to `/tmp/.mc/config.json`. Please update your access credentials.
# mc: Successfully created `/tmp/.mc/share`.
# mc: Initialized share uploads `/tmp/.mc/share/uploads.json` file.
# mc: Initialized share downloads `/tmp/.mc/share/downloads.json` file.
# Added `local` successfully.
# Bucket created successfully `local/sns-bucket`.
```