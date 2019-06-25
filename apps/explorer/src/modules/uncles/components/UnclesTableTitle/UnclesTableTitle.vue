<template>
  <div class="block-title">
    <div class="wrap pagination">
      <div class="the-title">{{ title }}</div>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  }
}
</script>

<style scoped lang="less">
@import 'UnclesTableTitle.less';
</style>
