/*import { Component, Vue } from 'vue-property-decorator'
import { Detail } from '@app/components/props'

// import Token Model

@Component
export class TokenDetailsMixin extends Vue {
  details = []
  holder = ''

  /* Methods:
  setDetails(token: Token) {
    this.details = [
      {
        title: this.$i18n.t('token.symbol'),
        detail: token.getSymbol()
      },
      {
        title: this.$i18n.t('addrOverview.creator'),
        detail: token.getContract(),
        link: '/contract/' + token.getContract()
      },
      {
        title: this.$i18n.t('token.price'),
        detail: token.getPrice(),
        copy: true
      },
      {
        title: this.$i18n.t('token.transfers'),
        detail: token.getTransfers
      },
      {
        title: this.$i18n.t('token.decimals'),
        detail: token.getDecimals()
      }
    ]
    if (this.holder !== '') {
      const holderInfo = [
        {
          title: this.$i18n.t(token.totalUSD),
          details: token.getBalance() * token.getPrice()
        },
        {
          title: this.$i18n.t('token.balance'),
          detail: token.getBalance()
        },
        {
          title: this.$i18n.t('token.holder'),
          detail: token.getHolder(),
          link: '/address/' + token.getHolder()
        }
      ]
      holderInfo.forEach(i => {
        this.details.unshift(i)
      })
    } else {
      const tokenInfo = [
        {
          title: this.$i18n.t('token.totalHold'),
          detail: token.getTotalHolders()
        },
        {
          title: this.$i18n.t('token.supply'),
          detail: token.getSupply()
        }
      ]
      tokenInfo.forEach(i => {
        this.details.push(i)
      })
    }
  }

  /* Computed:
  get tokenDetails(): Detail[] {
    return this.details
  }
} */
