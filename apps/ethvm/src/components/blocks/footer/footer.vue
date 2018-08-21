<template>
  <div id="footer">
    <div class="container">
      <div class="row">
        <div class="col-md-3">
          <h5>{{ $t( 'footer.about' ) }}</h5>
          <p>{{ $t( 'footer.aboutPar' ) }}</p>
        </div>
        <div class="col-md-3">
          <h5>{{ $t( 'footer.links' ) }}</h5>
          <ul>
            <li><a href="/blocks">{{ $t('title.blocks') }}</a></li>
            <li><a href="/transactions">{{ $t('title.tx') }}</a></li>
            <li><a href="/pending">{{ $t('title.pending') }}</a></li>
            <li><a href="/charts">{{ $t('title.charts') }}</a></li>
          </ul>
        </div>
        <div class="col-md-3">
          <h5>{{ $t( 'footer.find' ) }}</h5>
          <p><a href="mailto:support@ethvm.com">{{ $t( 'footer.email' ) }}</a></p>
          <p>{{ $t( 'footer.kb' ) }}</p>
        </div>
        <div class="col-md-3">
          <div class="input-block donate">
            <h5>{{ $t( 'footer.donate' ) }}</h5>
            <p><span>{{ $t( 'common.eth' ) }}:</span> <span>{{ $t( 'footer.ens' ) }}</span> <a href="https://etherscan.io/address/0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D">0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D</a></p>
            <p><span>{{ $t( 'footer.btc' ) }}:</span> <a href="https://blockchain.info/address/1DECAF2uSpFTP4L1fAHR8GCLrPqdwdLse9">1DECAF2uSpFTP4L1fAHR8GCLrPqdwdLse9</a></p>
          </div>
        </div>
      </div>
      <div class="copy-right-container">
        <div class="copy-right">
          <p>{{ $t( 'footer.copy' ) }}<a href="/about" class="text-white">{{ $t( 'footer.enkrypt' ) }}</a>.</p>
        </div>
        <div class="social-buttons">
          <a href="https://www.facebook.com/enKryptIO/" target="_blank"><i class="fa fa-facebook-f"></i></a>
          <a href="https://twitter.com/enkryptio" target="_blank"><i class="fa fa-twitter"></i></a>
          <a href="https://github.com/enKryptIO" target="_blank"><i class="fa fa-github"></i></a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

Vue.component('modal', {
  template: '#modal-template'
})

export default Vue.extend({
  data() {
    return {
      signup: false
    }
  },
  methods: {}
})
</script>

<style scoped lang="less">
@import '~lessPath/sunil/blocks/footer/footer.less';
</style>
