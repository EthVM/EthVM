<template>
  <div class="search">
    <input v-if="phText === 'default'" v-on:focus="searchFocus = true" v-on:blur="searchFocus = false" type="text" name="search" v-bind:placeholder="$t( 'search.default' )">
    <input v-if="phText === 'addressTxSearch'" v-on:focus="searchFocus = true" v-on:blur="searchFocus = false" type="text" name="search" v-bind:placeholder="$t( 'search.addressTx' )">
    <button><i class="fa fa-search"></i></button>
    <div v-if="searchFocus === true" class="search-result">
      <p><a href="">5121656486846536321513151684613513512165648684653632151315168461351351216564868465363215131516846135135121656486846536321513151</a></p>
      <p><a href="">6846135135121656486846536321513151684613513512165648684653632151315168461351351216564868465363215131516846135135121656486846536321513151</a></p>
      <p><a href="">6846135135121656486846536321513151684613513512165648684653632151315168461351351216564868465363215131516846135135121656486846536321513151</a></p>
      <p><a href="">165648684653632151315168461351351216564868465363215131516846135135121656486846536321513151</a></p>
      <p><a href="">6846135135121656486846536321513151684613513512165648684653632151315168461351351216564868465363215131516846135135121656486846536321513151</a></p>
      <p><a href="">36321513151684613513512165648684653632151315168461351351216564868465363215131516846135135121656486846536321513151</a></p>
      <p><a href="">6846135135121656486846536321513151684613513512165648684653632151315168461351351216564868465363215131516846135135121656486846536321513151</a></p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Search',
  props: {
    phText: {
      type: String,
      default: 'default'
    }
  },
  data() {
    return {
      searchFocus: false
    }
  }
})
</script>

<style scoped lang="less">
@import '~lessPath/sunil/blocks/smallBlocks/search.less';
</style>
