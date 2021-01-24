# Cloudfront + s3 + 署名付きURL + Versioningが可能かどうかをテストする

.envファイルで以下を設定
`VERSION`を指定しない場合は何もいれない

```
KEYPAIR_ID=xxxxxxxxxxxxx
PRIVATE_KEY_FILE=./cloudfront_key/pk-xxxxxxxxxxxxx.pem
DOMAIN=xxxxxxxxxxx.cloudfront.net
VERSION=
```