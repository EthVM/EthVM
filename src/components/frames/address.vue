<template>
  
  <div class="">
    
    <div class="container">


      <div class="page-title-container">
        <div class="page-title">
          <h3>Address Overview</h3>
          <h6 class="text-muted">Ethereum wallet address overview / Transactions information</h6>
        </div>

        <div class="search-block">
          <block-search></block-search>
        </div>
      </div>


      <div class="address-overview-container">

            <button class="top-right-button-common">More</button>

            <div class="address-top-info">
              <div class="address-identicon" style="background-image: url(&quot;data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAD3UlEQVR4Xu3dsW0cMRCFYV5iRYYDx8oUqwPVYCdqxx24EkVuQIk6UKRAgANVoFCGAbuIj8CAwH/57PDe/Hwk5/Z2L48/Xv4t+Hz7cgPRa316eqP4h9sPitfg++crusSfu2uK//X+SvGXACD9VgDkAERQDtASQAC1BLQHIIDaA5B8qz1Ap4BOATSHOgZ2DCSA6gPUByCANLg+QH0AYqg+QH0AAqg+QH0AAqg+AMlXH2DVB6gPQHOoPsDhfQA9Buk5XvMTvWut6fFrft4DaAH0C2j+AMA7grQAAWB7CNUvB0AL0AJMT6AACAC7KXSaYM2P9W8TqAWYttAAaBNIDEwDrPnbA1D56wPwPXFKsC5BWP/2AFqAAKgPQJNQAaTktYL959AcIAegSZgD2J9jOwUQfp0COgXgLWnqYLqEHu8AOIHHwwMAZ9B4BXEAARAAhFBLAMk3H5wD5ABEYQ5A8s0H5wA5AFGYA5B888E5QA5AFOYAJN98cA6QAxCFOQDJNx+cA+QARGEOQPLNB+cAOQBRmAOQfPPB4w7w+edfel+APuBhvgRnj0CfMnYJgADIAQ5mIAc4uHg7hh4AO1Q8+BoBcHDxdgw9AHaoePA1AuDg4u0YegDsUPHgawTAwcXbMfQA2KHiwdcIgIOLt2PoAbBDxYOvEQAHF2/H0ANgh4oHXyMADi7ejqEzANOvj9eXHukbS7QI0+PX/PyACC2AfgHNHwD4qFgtQADcEIOqXw5A8q+lBZieQAEQAPa+gGmCNT/WPwfQAkxbaAC0CSQGpgHW/O0BqPxtAvnVsUqwLkFY//YAWoAAqA9Ak1ABpOSrJaAl4P2VGFKA1UHbBFL5coAcIAeY3cSohaIBnH8K+Pr9N/07WG9I0AJMP5/g9O9/CQBDMADurk1BjM4B3kjBHIDkWysHyAEQIQtXB8wBTP8c4HQLxPoHQACcvQluCUALOH0CBEAA1AkUBnKAjoHCD8d2DHyyTphWIAfIAZQhis8BcgACqFMAyddvASifh5++BrsCdgV2AEvv0QFgGgaA6bd0E4bpOTwAUMIAQAE1vCXAFMwBTL+WANSPw3MAkzAHMP1yANSPw3MAkzAHMP1yANSPw3MAkzAHMP1yANSPw3MAkzAHMP1yANSPw3MAkzAHMP1ygIfbD5Lw/vmK4jU/JV9rTY9f87MDaAH0C2j+AMAnhGgBAmDWQXMAtIBpgDV/AASA/TWsJWB2E5sD4CkEDaBTQA6QA9AkUgtTAGnw9QHW0gIEQMdAmoQKICXPAXKAaQfT/PUB0AK0AOpgmj8AAqBGkDCgMzAH6Odg4Y8bUf8Bzyy6/bui1WgAAAAASUVORK5CYII=&quot;);"></div>
              <h2>Domain Name</h2>
            </div>

            <ul class="grid-block">
              <li>Address</li>
              <li>0xf3b0D5fC99Be8E26809A7bb16F9f5cC4aAFaF475</li>
              
              <li>Ether Balance</li>
              <li>123123.213123421</li>
              
              <li>USD Value</li>
              <li>$677.02 (@ $386.04/ETH)</li>
              
              <li>Mined</li>
              <li>23,534 Blocks and 239 Uncles</li>
              
              <li>Number of TXs</li>
              <li>231,743,553</li>
              
              <li>Contract Creator</li>
              <li>0x272f022a374fC7E9213B35952e167ea217303E18</li>

              <li>for TX</li>
              <li>0x272f022a374fC7E9213B35952e167ea217303E18</li>
            </ul>
          
        
        
      </div>


      <div class="tab-menu-container">
        <ul class="tabs">
          <li v-on:click="nav1on" v-bind:class="{ active: nav1 }">Transactions</li>
          <li v-on:click="nav2on" v-bind:class="{ active: nav2 }">Transaction History</li>
          <li v-on:click="nav3on" v-bind:class="{ active: nav3 }">Network History</li>
          <li v-on:click="nav4on" v-bind:class="{ active: nav4 }">Mining History</li>
        </ul>      

        <div class="tab-content">
          <div v-if="nav1 === true" class="">            
            <block-last-transactions :transactions="txs" :showheader="true"></block-last-transactions>
          </div>
          <div v-if="nav2 === true" class="">
            <button class="top-right-button-common">More</button>
            <div class="sub-tab tx-history-container">
              <ul>
                <li>Name:</li>
                <li>TWN</li>
                <li>Balance:</li>
                <li>20,930 TWN</li>
                <li>Value:</li>
                <li>$0.00</li>
                <li>ERC 20 Contract:</li>
                <li>0x045619099665fc6f661b1745e5350290ceb933f</li>
              </ul>
            </div>
          </div>
          <div v-if="nav3 === true" class="">
            <button class="top-right-button-common">More</button>
            <div class="sub-tab net-history-container">
              <ul>
                <li>Name:</li>
                <li>TWN</li>
                <li>Balance:</li>
                <li>20,930 TWN</li>
                <li>Value:</li>
                <li>$0.00</li>
                <li>ERC 20 Contract:</li>
                <li>0x045619099665fc6f661b1745e5350290ceb933f</li>
              </ul>
            </div>
          </div>
          <div v-if="nav4 === true" class="">
            <button class="top-right-button-common">More</button>
            <div class="sub-tab mining-history-container">
              <ul>
                <li>Name:</li>
                <li>TWN</li>
                <li>Balance:</li>
                <li>20,930 TWN</li>
                <li>Value:</li>
                <li>$0.00</li>
                <li>ERC 20 Contract:</li>
                <li>0x045619099665fc6f661b1745e5350290ceb933f</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

    </div><!-- container -->



  </div>

</template>

<script lang="ts">
import Vue from 'vue';
const MAX_ITEMS = 20
export default Vue.extend({
  name: 'FrameAccount',
  
  data() {
    return {
      nav1 : true,
      nav2 : false,
      nav3 : false,
      nav4 : false
    }
  },
  
  methods: {
    alloff(){
      this.nav1 = false
      this.nav2 = false
      this.nav3 = false
      this.nav4 = false
    },

    nav1on(){
      this.alloff()
      this.nav1 = true
    },

    nav2on(){
      this.alloff()
      this.nav2 = true
    },

    nav3on(){
      this.alloff()
      this.nav3 = true
    },

    nav4on(){
      this.alloff()
      this.nav4 = true
    }
  },
  computed:{
    txs(){
        if(this.$store.getters.getTxs.length) return this.$store.getters.getTxs.slice(0, MAX_ITEMS)
        else return []
    }
  }

})

</script>

<style scoped="" lang="less">
  @import "~lessPath/sunil/frames/address.less";
</style>
