require('dotenv').config();
const AWS = require('aws-sdk');
const fs = require('fs-extra');
const moment = require('moment');

// 対象となるリソースのURL
domain = process.env.DOMAIN;
const target = `https://${domain}/20191108221114.png`;

/**
 * AWS.CloudFront.Signer.getSignedUrlを呼び出す。
 *
 * Class: AWS.CloudFront.Signer — AWS SDK for JavaScript
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront/Signer.html
 * @param {String} keypairId
 * @param {String} privateKey
 * @param {Object} options 
 */
function getSignedUrlAsync(keypairId, privateKey, options) {
  console.log('keypairId',keypairId)
  console.log('privateKey', privateKey)
  return new Promise((resolve, reject) => {
    // Signerインスタンスを生成
    const signer = new AWS.CloudFront.Signer(keypairId, privateKey);
    // URL生成
    signer.getSignedUrl(options, (err, url) => {
      if (err) {
        reject(err);
      }
      resolve(url);
    });
  });
}

async function main() {
  // private keyを読み込む
  const privateKey = await fs.readFile(process.env.PRIVATE_KEY_FILE, { encoding: 'utf-8' });

  // 期限を設定
  // 現在日時から1日後まで有効とする
  const expires = moment.utc().add(1, 'days').unix();

  // URL生成
  const url = await getSignedUrlAsync(
    // キーペアのID
    // AWSコンソールの以下の場所で確認可能
    // セキュリティ認証情報 > CloudFront のキーペア > アクセスキーID
    process.env.KEYPAIR_ID,
    // 秘密鍵を渡す
    privateKey,
    {
      // 対象となるCloudFrontのURL
      url: target,
      // 生成されるURLの期限 (UTCのunixtime)
      expires: expires
    }
  );

  console.log(url);
}

main().then(() => {
  console.log('done.');
}).catch((err) => {
  console.error(err);
});