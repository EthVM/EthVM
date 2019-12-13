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
  IS_GETH: process.env.IS_GETH === 'true' || false,
  PUBLISH_WS: process.env.PUBLISH_WS === 'true' || false,
  WS_PUBLISH_PORT: process.env.WS_PUBLISH_PORT || 8547,
  PUBLISH_INFLUX: process.env.PUBLISH_INFLUX === 'true' || false,
  INFLUX_URL: process.env.INFLUX_URL || '',
  INFLUX_ORG: process.env.INFLUX_ORG || '',
  INFLUX_BUCKET: process.env.INFLUX_BUCKET || '',
  INFLUX_TOKEN: process.env.INFLUX_TOKEN || '',
  TOKEN_KEY_PREFIX: process.env.TOKEN_KEY_PREFIX || 'TOKENS/'
}
