<template>
  <v-dialog v-model="dialog" max-width="400">
    <v-btn flat color="black" fab slot="activator" class="black--text" large>
      <v-icon>fas fa-qrcode</v-icon>
    </v-btn>
    <v-card>
      <v-layout column align-center justify-center pa-2>
        <v-flex xs12>
          <vue-qr v-if="getQR" text="getQR" :size="260"></vue-qr>
        </v-flex>
        <v-flex xs12>
          <v-card-title class="title font-weight-medium">{{ $t('title.address') }}:</v-card-title>
        </v-flex>
        <v-flex xs12>
          <p class="break-string">{{ address-QR }}</p>
        </v-flex>
      </v-layout>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import VueQr from 'vue-qr'
export default Vue.extend({
  components: {
    VueQr
  },
  name: 'AppAddressQR',
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
    return {
      dialog: false
    }
  },
  computed: {
    getQR() {
      if (this.addressQR) {
        return this.addressQR.toLowerCase()
      }
      return null
    }
  }
})
</script>
