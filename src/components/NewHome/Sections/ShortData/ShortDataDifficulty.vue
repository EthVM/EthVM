<template>
    <small-block-component :title="blockTitle" :value="hashRate" :icon-name="blockIconType" :icon-color="blockIconColor"></small-block-component>
</template>

<script lang="ts">
  import Vue from 'vue'
  export default Vue.extend({
    name: 'ShortDataLastBlock',
    data () {
      return {
        blockTitle: 'Difficulty TH/s',
        blockIconType: 'asterisk',
        blockIconColor: '#6bee69',
        hashRate: '5,100.00'
      }
    }
  })
</script>

