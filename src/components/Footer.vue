<template>
  <div class="footer">
    <div class="footer-container">
      <div class="container">
        <div class="row">
          
          <!-- Logo Column -->
          <div class="col-md-6">
            <div class="footer-block-1">
              <img class="footer-logo" src="/img/logo.png">
              <div class="footer-text">
                <p>Free, open-source, client-side interface for exploring blocks and transactions for Ethereum and more.</p>
                <p>© 2017 EVM Inc. ALL RIGHTS RESERVED.</p>
              </div>
            </div>
          </div>



          <!-- Contacts/Social Media Column -->
          <div class="col-md-6">
            <div class="footer-block-3 text-right">

              <div class="footer-links ">
                
                <p>About</p>
                <p>Contact</p>
                <p>FAQ</p>
            
              </div>
                            
              <div class="social-footer-block ">
                <icon name='facebook' scale='1.7'></icon>
                <icon name='twitter' scale='1.7'></icon>
                <icon name='github' scale='1.7'></icon>
                <icon name='reddit' scale='1.7'></icon>

                
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
