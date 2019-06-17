<template>
  <div class="transform-hash-container">
    <router-link v-if="link" :to="url">
      <div :class="hashClass">
        <div class="hash-section">{{ first }}</div>
        <div class="concat hash-section">{{ middle }}</div>
        <div class="hash-section">{{ last }}</div>
      </div>
    </router-link>
    <div :class="hashClass" v-else>
      <div class="hash-section">{{ first }}</div>
      <div class="concat hash-section">{{ middle }}</div>
      <div class="hash-section">{{ last }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class AppTransformHash extends Vue {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop(String) hash!: string
  @Prop({ type: Boolean, default: false }) italic!: boolean
  @Prop(String) link!: string
  @Prop({ type: Boolean, default: true }) isBlue!: boolean

  /*
  ===================================================================================
    Computed
  ===================================================================================
  */

  get last(): string {
    const n = this.hash.length
    return this.hash.slice(n - 4, n)
  }
  get first(): string {
    return this.hash.slice(0, 4)
  }
  get middle(): string {
    const n = this.hash.length
    return this.hash.slice(4, n - 4)
  }

  get hashClass(): string {
    if (!this.isBlue) {
      return this.italic ? 'hash-container font-italic black--text font-mono' : ' hash-container black--text font-mono'
    }
    return this.italic ? 'hash-container font-italic secondary--text font-mono' : ' hash-container secondary--text font-mono'
  }

  get url(): string {
    return this.link
  }
}
</script>

<style scoped lang="less">
.concat {
  overflow: hidden;
  text-overflow: ellipsis;
}
.transform-hash-container {
  overflow: hidden;
}
.hash-container {
  min-width: 80px;
  display: flex;
  flex-shrink: 2;
}
.hash-section {
  display: inline;
}
</style>
