import AWS from 'aws-sdk';
import Configs from '../configs';
const credentials = new AWS.SharedIniFileCredentials({
  profile: Configs.AWS_PROFILE
});
AWS.config.credentials = credentials;
AWS.config.update({
  region: Configs.AWS_REGION
});
class SNS {
  constructor(topicARN) {
    this.arn = topicARN;
    this.sns = new AWS.SNS({ apiVersion: '2010-03-31' });
  }

  publish(blockNumber) {
    return new Promise((resolve, reject) => {
      const msgObj = {
        chain: Configs.CHAIN,
        number: blockNumber
      };
      var params = {
        Message: JSON.stringify(msgObj),
        TopicArn: this.arn
      };
      this.sns
        .publish(params)
        .promise()
        .then(data => {
          resolve(data);
        })
        .catch(reject);
    });
  }
}
export default SNS;
