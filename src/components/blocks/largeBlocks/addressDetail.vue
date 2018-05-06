<template>

<div class="address-overview-container">
            <button class="top-right-button-common">More</button>

            <div class="address-top-info">
              <div class="address-identicon" style="background-image: url(&quot;data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAD3UlEQVR4Xu3dsW0cMRCFYV5iRYYDx8oUqwPVYCdqxx24EkVuQIk6UKRAgANVoFCGAbuIj8CAwH/57PDe/Hwk5/Z2L48/Xv4t+Hz7cgPRa316eqP4h9sPitfg++crusSfu2uK//X+SvGXACD9VgDkAERQDtASQAC1BLQHIIDaA5B8qz1Ap4BOATSHOgZ2DCSA6gPUByCANLg+QH0AYqg+QH0AAqg+QH0AAqg+AMlXH2DVB6gPQHOoPsDhfQA9Buk5XvMTvWut6fFrft4DaAH0C2j+AMA7grQAAWB7CNUvB0AL0AJMT6AACAC7KXSaYM2P9W8TqAWYttAAaBNIDEwDrPnbA1D56wPwPXFKsC5BWP/2AFqAAKgPQJNQAaTktYL959AcIAegSZgD2J9jOwUQfp0COgXgLWnqYLqEHu8AOIHHwwMAZ9B4BXEAARAAhFBLAMk3H5wD5ABEYQ5A8s0H5wA5AFGYA5B888E5QA5AFOYAJN98cA6QAxCFOQDJNx+cA+QARGEOQPLNB+cAOQBRmAOQfPPB4w7w+edfel+APuBhvgRnj0CfMnYJgADIAQ5mIAc4uHg7hh4AO1Q8+BoBcHDxdgw9AHaoePA1AuDg4u0YegDsUPHgawTAwcXbMfQA2KHiwdcIgIOLt2PoAbBDxYOvEQAHF2/H0ANgh4oHXyMADi7ejqEzANOvj9eXHukbS7QI0+PX/PyACC2AfgHNHwD4qFgtQADcEIOqXw5A8q+lBZieQAEQAPa+gGmCNT/WPwfQAkxbaAC0CSQGpgHW/O0BqPxtAvnVsUqwLkFY//YAWoAAqA9Ak1ABpOSrJaAl4P2VGFKA1UHbBFL5coAcIAeY3cSohaIBnH8K+Pr9N/07WG9I0AJMP5/g9O9/CQBDMADurk1BjM4B3kjBHIDkWysHyAEQIQtXB8wBTP8c4HQLxPoHQACcvQluCUALOH0CBEAA1AkUBnKAjoHCD8d2DHyyTphWIAfIAZQhis8BcgACqFMAyddvASifh5++BrsCdgV2AEvv0QFgGgaA6bd0E4bpOTwAUMIAQAE1vCXAFMwBTL+WANSPw3MAkzAHMP1yANSPw3MAkzAHMP1yANSPw3MAkzAHMP1yANSPw3MAkzAHMP1yANSPw3MAkzAHMP1ygIfbD5Lw/vmK4jU/JV9rTY9f87MDaAH0C2j+AMAnhGgBAmDWQXMAtIBpgDV/AASA/TWsJWB2E5sD4CkEDaBTQA6QA9AkUgtTAGnw9QHW0gIEQMdAmoQKICXPAXKAaQfT/PUB0AK0AOpgmj8AAqBGkDCgMzAH6Odg4Y8bUf8Bzyy6/bui1WgAAAAASUVORK5CYII=&quot;);"></div>
              <h2>Domain Name</h2>
            </div>

            <ul class="grid-block">
              <li>Address</li>
              <li>{{account.address}}</li>
              
              <li>Ether Balance</li>
              <li>{{account.balance}}</li>
              
              <li>USD Value</li>
              <li>${{account.balance * account.ethusd}} (@ ${{account.ethusd}}/ETH)</li>
              
              <li>Mined</li>
              <li>23,534 Blocks and 239 Uncles</li>
              
              <li>Number of TXs</li>
              <li>{{account.totalTxs}}</li>
              
              <li>Contract Creator</li>
              <li>0x272f022a374fC7E9213B35952e167ea217303E18</li>

              <li>for TX</li>
              <li>0x272f022a374fC7E9213B35952e167ea217303E18</li>
            </ul>
        
      </div>
</template>


<script lang="ts">
import Vue from 'vue';

 export default Vue.extend({
  name: 'Address',
  props: [
    'account'
  ],
  data() {
    return { 
    }
  },
  methods: {},
  computed: {}
})

</script>



<style scoped="" lang="less">
  @import "~lessPath/sunil/frames/address.less";
</style>
  
 