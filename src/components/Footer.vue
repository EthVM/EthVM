<template>
  <div class="footer">
    <div class="footer-container">
      <div class="container">
        <div class="row">
          

          <div class="col-md-4">
            <div class="footer-block-1">
              <img class="footer-logo" src="/img/logo.png">
              <p>Free, open-source, client-side interface for generating Ethereum wallets & more. Interact with the Ethereum blockchain easily & securely. Double-check the URL ( .com ) before unlocking your wallet.</p>
              <p>© 2017 EVM Inc. ALL RIGHTS RESERVED.</p>
            </div>
          </div>

          <div class="col-md-5">
            <div class="footer-block-2">
              
              <div class="support-block">
                <h1>You can support us by supporting our blockchain-family</h1>
                <p class="support-link">Swap ETH/BTC/EUR/CHF via Bity.com</p>
              </div>


              <div class="support-block">
                <h1>Donations are always appreciated</h1>
                <p class="support-link">ETH: <span>mewtopia.eth 0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8</span></p>
              </div>

                
            </div>
          </div>

          <div class="col-md-3">
            <div class="footer-block-3">

              <div class="footer-links">
                
                <p>Services</p>
                <p>Terms</p>
                <p>Guide</p>
                <p>Knowledge Base</p>
                <p>Disclaimer</p>
                <p>Contact</p>
              </div>
                            
              <div class="social-footer-block">
                <icon name='facebook-square' scale='1.7'></icon>
                <icon name='twitter-square' scale='1.7'></icon>
                <icon name='github-square' scale='1.7'></icon>
                <icon name='slack' scale='1.7'></icon>
                
              </div>

            </div>
          </div>


        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'Footer'
})
</script>

<style scoped lang="less">
@import "~lessPath/footer.less";
</style>
