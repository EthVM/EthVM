<template>
  <div class="block-title">
    <div class="wrap" :class="pageType != 'home' ? 'pagination' : ''">
      <div v-if="pageType == 'home'" class="the-title">{{ $t('block.last') }}</div>
      <div v-else class="the-title">{{ title }}</div>
      <a v-if="pageType == 'home'" class="button-link" href="/blocks"
        ><button>{{ $t('btn.view-all') }}</button></a
      >
      <slot v-if="pageType != 'home'"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop } from 'vue-property-decorator'

export default class BlockTableTitle extends Vue {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */
  @Prop({ type: String, default: '' }) title!: string
  @Prop({ type: String, default: '' }) pageType!: string
}
</script>

<style scoped lang="less">
@import 'BlockTableTitle.less';
</style>
