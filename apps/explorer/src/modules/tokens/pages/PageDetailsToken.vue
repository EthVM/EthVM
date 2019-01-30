<template>
  <v-container grid-list-lg class="mb-0">
    <details-list-tokens :contract="contract" :token="token"></details-list-tokens>
  </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import AppSocialLink from '@app/core/components/ui/AppSocialLink.vue'
import DetailsListTokens from '@app/modules/tokens/components/DetailsListTokens.vue'
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Events } from 'ethvm-common'
import { Detail } from '@app/core/components/props'
import { Token } from '@app/core/models'

const MAX_ITEMS = 10

@Component({
  components: {
    AppBreadCrumbs,
    DetailsListTokens
  }
})
export default class PageDetailsToken extends Vue {
  @Prop({ type: String }) addressRef!: string
  address = ''
  contract = {}
  tokens = {}
  token = {}
  tokenTransfers = []

  /*
  ===================================================================================
    Mounted
  ===================================================================================
  */

  async mounted() {
    try {
      this.address = this.addressRef.replace('0x', '')
      this.contract = await this.fetchContractDetails()
      this.tokens = await this.fetchTokens()
      this.token = this.tokens.find(obj => {
        return obj.address === this.addressRef
      })
      console.log('eyy')
      this.tokenTransfers = await this.fetchAddressTokensTransfers()
      // console.log('t', this.token)
      // console.log(this.contract)
      console.log('t', this.tokenTransfers)
    } catch (e) {
      console.log('e', e)
      // handle error accordingly
    }
  }

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  /**
   * Retrieve contract details for a the given token contract address.
   * @return {Object} - Contract details and metadata
   */
  fetchContractDetails() {
    return new Promise((resolve, reject) => {
      return this.$api.getContract(this.addressRef)
        .then(result => {
          resolve(result)
        })
        .catch(e => {
          reject(e)
        })
    })
  }

  /**
   */
  fetchAddressTokensTransfers(page = 0, limit = MAX_ITEMS, filter = 'all') {
    return new Promise((resolve, reject) => {
      this.$socket.emit(Events.getAddressTokensTransfers, { address: this.addressRef, filter: filter, limit: limit, page: page }, (err, result) => (err ? reject(err) : resolve(result)))
      // return this.$api.getAddressTokensTransfers(this.addressRef, filter, limit, page)
      //   .then(result => {
      //     resolve(result)
      //   })
      //   .catch(e => {
      //     console.log('dsdsd', e)
      //     reject(e)
      //   })
    })
  }

  /**
   * GET and return a JSON array of ETH-based tokens
   *
   * @return {Array} - Array of ETH Tokens.
   */
  fetchTokens() {
    return new Promise((resolve, reject) => {
      this.$http
        .get('http://api.ethplorer.io/getTop?apiKey=freekey&criteria=cap')
        .then(response => {
          resolve(response.data.tokens)
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  /*
  ===================================================================================
    Old
  ===================================================================================
  */

  // // Methods:
  // setDetails(token: Token) {
  //   this.details = [
  //     {
  //       title: this.$i18n.t('token.symbol'),
  //       detail: token.getSymbol()
  //     },
  //     // {
  //     //   title: this.$i18n.t('addrOverview.creator'),
  //     //   detail: token.getContract(),
  //     //   link: '/contract/' + token.getContract()
  //     // },
  //     {
  //       title: this.$i18n.t('token.price'),
  //       detail: token.getPrice(),
  //       copy: true
  //     },
  //     // {
  //     //   title: this.$i18n.t('token.transfers'),
  //     //   detail: token.getTransfers()
  //     // },
  //     {
  //       title: this.$i18n.t('token.decimals'),
  //       detail: token.getDecimals()
  //     }
  //   ]
  //   if (this.holder !== '') {
  //     const holderInfo = [
  //       // {
  //       //   title: this.$i18n.t('token.totalUSD'),
  //       //   details: token.getBalance() * token.getPrice()
  //       // },
  //       // {
  //       //   title: this.$i18n.t('token.balance'),
  //       //   detail: token.getBalance()
  //       // },
  //       {
  //         title: this.$i18n.t('token.holder'),
  //         detail: token.getHolder(),
  //         link: '/address/' + token.getHolder()
  //       }
  //     ]
  //     holderInfo.forEach(i => this.details.unshift(i))
  //   } else {
  //     const tokenInfo = [
  //       {
  //         title: this.$i18n.t('token.totalHold'),
  //         detail: token.getTotalHolders()
  //       },
  //       {
  //         title: this.$i18n.t('token.supply'),
  //         detail: token.getTotalSupply()
  //       }
  //     ]
  //     tokenInfo.forEach(i => this.details.push(i))
  //   }
  // }
}
</script>
