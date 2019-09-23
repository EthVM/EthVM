import Configs from '../configs'
import request from 'request'
class InfluxPublish {
  constructor() {
    this.host = Configs.INFLUX_URL
    this.token = Configs.INFLUX_TOKEN
    this.bucket = Configs.INFLUX_BUCKET
    this.orgID = Configs.INFLUX_ORG
  }

  publish(blockNumber) {
    return new Promise((resolve, reject) => {
      request.post(
        {
          url: `${this.host}/api/v2/write?org=${this.orgID}&bucket=${this.bucket}&precision=ms`,
          body: `blocks,chain=${Configs.CHAIN} blockNumber=${blockNumber}`,
          headers: {
            Authorization: `Token ${this.token}`
          }
        },
        (error, response, body) => {
          if (error) return reject(error)
          else resolve(body)
        }
      )
    })
  }
}
export default InfluxPublish
