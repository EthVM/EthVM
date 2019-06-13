<template>
  <div class="block-title">
    <div class="wrap">
      <div class="the-title">{{ title }}</div>
      <a v-if="buttonText" class="button-link" :href="buttonLink"
        ><button>{{ buttonText }}</button></a
      >
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
    },
    buttonText: {
      type: String,
      default: ''
    },
    buttonLink: {
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
@import 'BlockTitle.less';
</style>
