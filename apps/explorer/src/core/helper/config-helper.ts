declare var process: {
  env: {
    NODE_ENV: string,
    VUE_APP_API_ENDPOINT: string,
    VUE_APP_API_SUBSCRIPTIONS_ENPOINT: string,
    VUE_APP_SENTRY_SECURITY_TOKEN: string,
    VUE_APP_NETWORK: string
  }
}

export class ConfigHelper {

  public static get network(): string {
    return process.env.VUE_APP_NETWORK
  }

}
