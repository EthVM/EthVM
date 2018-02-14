<template>
  <div id="footer">
    <div class="container">
      
      <div class="row">
        <div class="col-md-2">
          <h5>About Us</h5>
          <p>EthVM project is brought to you by kvhnuke, founder of MyEtherWallet and enKrypt. EthVM is a free and open source  interface for exploring and evaluating real time Ethereum blocks, transactions and more.</p>

          <div class="social-buttons">

            <i class="fa fa-quora"></i>
            <i class="fa fa-google-plus"></i>
            <i class="fa fa-twitter"></i>
            <i class="fa fa-facebook-f"></i>
            <i class="fa fa-tumblr"></i>

          </div>
        </div>
        <div class="col-md-2">
          <h5>Quick Links</h5>
          <ul>
            <li><a href="#">Last Blocks</a></li>
            <li><a href="#">Latest Transactions</a></li>
            <li><a href="#">Pending Transactions</a></li>
            <li><a href="#">Charts</a></li>
          </ul>
        </div>
        <div class="col-md-2">
          <h5>Find Us</h5>
          <p>Los Angeles, CA, USA</p>
          <p>Ph. 213-123-4567</p>
          <p>E: <a href="">support@ethvm.com</a></p>
        </div>
        <div class="col-md-6">
          <div class="input-block">
            <h5>Connect With Us</h5>
            <input type="text" name="email" placeholder="Your email address">
            <button>Sign Up</button>
          </div>


          <div class="input-block">
            <h5>Donate <span>Etherium Wallet</span></h5>
            <input type="text" name="email" placeholder="0x829bd824b016326a401d083b33d092293333a830">
            <button>Donate</button>
          </div>
        </div>
      </div>

      <p class="copy-right">All rights reserved by <a href="#" class="text-white">Ethereum Virtual Machine</a>.</p>

    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  export default Vue.extend({
    data () {
      return {}
    }
  })
</script>

<style scoped lang="less">
  @import "~lessPath/sunil/blocks/footer/footer.less";
</style>
