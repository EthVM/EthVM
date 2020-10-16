<template lang="html">
    <div v-show="address" ref="identicon" class="blockie" />
</template>

<script lang="ts">
import createIcon from '@app/modules/address/helpers/blockies'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component
export default class Blockies extends Vue {
    /*
  ===================================================================================
    Props
  ===================================================================================
  */

    @Prop({ type: String, default: '' }) address!: string
    @Prop({ type: String, default: '50px' }) width!: string
    @Prop({ type: String, default: '50px' }) height!: string

    /*
  ===================================================================================
    Lifecycle
  ===================================================================================
  */

    mounted() {
        if (this.address) {
            this.setBlockie()
        }
    }

    /*
  ===================================================================================
    Watch Events
  ===================================================================================
  */

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

    /*
  ===================================================================================
    Methods
  ===================================================================================
  */
    /**
     * Creates and sets a blockie
     */
    setBlockie(): void {
        const data = createIcon({
            seed: this.address ? this.address.toLowerCase() : '',
            size: 8,
            scale: 4
        }).toDataURL()
        const identicon = this.$refs.identicon as any
        const style = identicon.style as any
        style.width = this.width
        style.height = this.height
        style.backgroundImage = `url('${data}')`
    }
}
</script>

<style scoped lang="scss">
.blockie {
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 50%;
    height: 100%;
    width: 100%;
}
</style>
