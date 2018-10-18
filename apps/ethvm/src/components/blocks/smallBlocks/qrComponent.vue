
<template>
  <div>
    <v-menu transition="slide-y-transition" bottom>
      <v-btn slot="activator" icon>
          <!-- <v-img :src="require('@/assets/qrcode.png')" height="50px" contain ></v-img> !-->
          <v-icon v-if="large" large>fas fa-qrcode</v-icon>
          <v-icon v-else>fas fa-qrcode</v-icon>
      </v-btn>
      <v-list>
        <v-list-tile>
          <v-list-tile-content>
           <vue-qr v-if="getQR" text="getQR" :size="40"></vue-qr>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-menu>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import VueQr from 'vue-qr'
export default Vue.extend({
  components: {
    VueQr
  },
  name: 'AddressQR',
  props: {
    addressQR: {
      type: String
    },
    large: {
      type: Boolean,
      deafult: false
    }
  },
  data() {
    return {}
  },
  computed: {
    getQR() {
      console.log(this.addressQR)
      if (this.addressQR) {
        return this.addressQR.toLowerCase()
      }
      return null
    }
  }
})
</script>

<style scoped lang="less">
@import '~lessPath/sunil/blocks/largeBlocks/addressDetail.less';
</style>


