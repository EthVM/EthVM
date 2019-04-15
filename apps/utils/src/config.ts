import convict from 'convict'

const schema = {
  tokens: {
    url: {
      doc: 'List of Ethereum Tokens',
      default: 'https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/dist/tokens/eth/tokens-eth.min.json',
      env: 'TOKENS_URL'
    }
  }
}

export class Config {
  private config: convict.Config<any>

  constructor() {
    this.config = convict(schema)
  }

  public load(overrides: any) {
    const { config } = this
    config.load(overrides)
    config.validate({ allowed: 'strict' })
  }

  get ethTokensUrl(): string {
    return this.config.get('tokens.url')
  }

}
