import dotenv from 'dotenv'
dotenv.config()
export default {
  CHAIN: process.env.CHAIN || '',
  WS_HOST: process.env.WS_HOST || '',
  S3_BUCKET: process.env.S3_BUCKET || '',
  AWS_PROFILE: process.env.AWS_PROFILE || 'default',
  AWS_REGION: process.env.AWS_REGION || '',
  AWS_SNS_TOPIC: process.env.AWS_SNS_TOPIC || '',
  SAVE_STATUS: process.env.SAVE_STATUS === 'true' || false,
  PUBLISH_SNS: process.env.PUBLISH_SNS === 'true' || false,
  MAX_CONCURRENT: process.env.MAX_CONCURRENT || 10,
  IS_GETH: process.env.IS_GETH === 'true' || false
}
