<template lang="html">
  <div v-show="address" ref="identicon" class="blockie" />
</template>

<script>
import createIcon from '@/helpers/blockies'
export default {
  name: 'AppBlockies',
  props: {
    address: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '50px'
    },
    height: {
      type: String,
      default: '50px'
    }
  },
  data() {
    return {}
  },
  watch: {
    address() {
      this.setBlockie()
    },
    width() {
      this.setBlockie()
    },
    height() {
      this.setBlockie()
    }
  },
  mounted() {
    if (this.address) {
      this.setBlockie()
    }
  },
  methods: {
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
