<template>
<div class="latesttransaction">
  <Header></Header>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <TxPagination :max-items="20000" :per="25"></TxPagination>
      </div>
    </div>
  </div>
  <Footer></Footer>
</div>

</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'LatestTransactions'
})
</script>

<style scoped="" lang="less">
@import '~lessPath/LatestTransaction/LatestTransaction';
</style>
