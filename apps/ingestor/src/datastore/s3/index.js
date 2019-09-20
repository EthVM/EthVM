import AWS from 'aws-sdk';
import LZUTF8 from 'lzutf8';
import Configs from '../../configs';
const credentials = new AWS.SharedIniFileCredentials({
  profile: Configs.AWS_PROFILE
});
AWS.config.credentials = credentials;
AWS.config.update({
  region: Configs.AWS_REGION
});
const FILE_EXTENSION = '.json.lz';
class S3DB {
  constructor(bucketName) {
    this.db = new AWS.S3();
    this.bucketName = bucketName;
  }

  get(key) {
    return new Promise((resolve, reject) => {
      this.db.getObject(
        {
          Bucket: this.bucketName,
          Key: key + FILE_EXTENSION
        },
        (err, data) => {
          if (err) {
            reject(err);
          } else {
            const body = LZUTF8.decompress(data.Body);
            resolve(JSON.parse(body));
          }
        }
      );
    });
  }

  put(key, value) {
    return new Promise((resolve, reject) => {
      this.db.putObject(
        {
          Bucket: this.bucketName,
          Body: LZUTF8.compress(JSON.stringify(value), {
            outputEncoding: 'Buffer'
          }),
          ContentType: 'application/json',
          Key: key + FILE_EXTENSION,
          Metadata: value.Metadata
        },
        function(err, data) {
          if (err) return reject(err);
          resolve(data);
        }
      );
    });
  }

  delete(key) {
    return new Promise((resolve, reject) => {
      this.db.deleteObject(
        {
          Bucket: this.bucketName,
          Key: key + FILE_EXTENSION
        },
        (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        }
      );
    });
  }
}

export default S3DB;
