<template lang="html">
  <div v-show="address" ref="identicon" class="blockie" />
</template>

<script lang="ts">
import createIcon from '@app/helpers/blockies'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component
export default class AppBlockies extends Vue {
  @Prop({ type: String, default: '' }) address!: string
  @Prop({ type: String, default: '50px' }) width!: string
  @Prop({ type: String, default: '50px' }) height!: string

  mounted() {
    if (this.address) {
      this.setBlockie()
    }
  }

  @Watch('address')
  onAddressChanged() {
    this.setBlockie()
  }

  @Watch('width')
  onWidthChanged() {
    this.setBlockie()
  }

  @Watch('height')
  onHeightChanged() {
    this.setBlockie()
  }

  // Methods
  setBlockie() {
    const data = createIcon({
      seed: this.address.toLowerCase(),
      size: 8,
      scale: 8
    }).toDataURL()
    this.$refs.identicon.style.width = this.width
    this.$refs.identicon.style.height = this.height
    this.$refs.identicon.style.backgroundImage = `url('${data}')`
  }
}
</script>

<style scoped lang="css">
.blockie {
  border-radius: 50px;
  min-width: 50px;
  height: 100%;
  margin: 5px;
}
</style>
