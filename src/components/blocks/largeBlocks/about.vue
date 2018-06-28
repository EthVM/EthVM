<template>
  <div class="about">
    <div class="wrap">
      <div class="grid-container">
        <div class="what-is-ethvm">
          <img class="logo-image" src="~@/assets/logo.png">
          <h2 class="">What is EthVM?</h2>
          <p>
            EthVM project is brought to you by kvhnuke, founder of
            MyEtherWallet and enKrypt. EthVM is a free and open source
            interface for exploring and evaluting real time Ethereum
            blocks, transactions and more. This software is under MIT
            License.
          </p>
        </div>
        <div class="github">
          <i class="fa fa-github" aria-hidden="true"></i>
          <h2>GitHub</h2>
          <p>If you want to contribute, make a request on GitHub.</p>
        </div>
        <div class="medium">
          <i class="fa fa-medium" aria-hidden="true"></i>
          <h2>Medium</h2>
          <p>
            If you want to listen/share our awesome thoughts
            check our medium account.
          </p>
        </div>
        <div class="social">
          <h2>Social</h2>
          <p>
            If you want to reach out to us, please do so by
            following one or all of these.
          </p>
          <div>
            <a href="https://www.facebook.com/enKryptIO/" target="_blank">
              <i class="fa fa-facebook" aria-hidden="true"></i>
            </a>
            <a href="https://twitter.com/enkryptio" target="_blank">
              <i class="fa fa-twitter" aria-hidden="true"></i>
            </a>
          </div>
        </div>
        <div class="disclaimer">
          <h2>Disclaimer</h2>
          <p>
            MIT License Copyright © 2017-2018 enKrypt LLC
            Permission is hereby granted, free of charge, to any
            person obtaining a copy of this software and associated
            documentation files (the "Software"), to deal in the Software
            without restriction, including without limitation the rights
            to use, copy, modify, merge, publish, distribute, sublicense,
            and/or sell copies of the Software, and to permit persons
            to whom the Software is furnished to do so, subject to the
            following conditions:
            The above copyright notice and this permission notice
            shall be included in all copies or substantial portions
            of the Software.
          </p>
          <p class="disclaimer">
            THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
            EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
            OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
            NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
            HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
            WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
            FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
            OR OTHER DEALINGS IN THE SOFTWARE.
          </p>
        </div>
      </div><!-- .grid-container -->
    </div><!-- .wrap -->
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  export default Vue.extend({
    name: 'ShortDataLastBlock',
    data() {
      return {
      }
    }
  })
</script>

<style scoped lang="less">
  @import "~lessPath/sunil/blocks/largeBlocks/about.less";
</style>