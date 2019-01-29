<template>
  <v-container grid-list-lg class="mb-0">
    <app-list-details :items="contractDetails" :details-type="listType" :loading="isLoadingDetails">
        <!-- <app-list-title slot="details-title" :list-type="listType" /> -->
    </app-list-details>
  </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import AppListDetails from '@app/core/components/ui/AppListDetails.vue'
import AppListTitle from '@app/core/components/ui/AppListTitle.vue'
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Events } from 'ethvm-common'
import { Detail } from '@app/core/components/props'
import { Token } from '@app/core/models'

@Component({
  components: {
    AppBreadCrumbs,
    AppListDetails,
    AppListTitle
  }
})
export default class PageDetailsToken extends Vue {
  @Prop({ type: String }) addressRef!: string
  address = ''
  contract = {}
  listType = 'tx'
  details = []
  holder = ''

  /*
  ===================================================================================
    Mounted
  ===================================================================================
  */

  async mounted() {
    try {
      this.address = this.addressRef.replace('0x', '')
      this.contract = await this.fetchContractDetails()
      console.log(this.contract)
    } catch (e) {
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
      this.$socket.emit(Events.getContract, { address: this.address }, (err, result) => (err ? reject(err) : resolve(result)))
    })
  }

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  get contractDetails(): Detail[] {
    return [
      {
        title: this.$i18n.t('title.contract'),
        detail: this.addressRef
      },
      {
        title: this.$i18n.t('title.links'),
        detail: '<h1>Test</h1>'
      }
    ]
  }

  get isLoadingDetails(): boolean {
    return Object.keys(this.contract).length === 0
  }

  /*
  ===================================================================================
    Ol
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
