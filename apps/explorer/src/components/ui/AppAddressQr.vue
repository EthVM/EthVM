<template>
  <v-dialog v-model="dialog" max-width="400">
    <v-btn flat color="black" fab slot="activator" class="black--text" large> <v-icon>fas fa-qrcode</v-icon> </v-btn>
    <v-card>
      <v-layout column align-center justify-center pa-2>
        <v-flex xs12> <vue-qr v-if="getQR" text="getQR" :size="260"></vue-qr> </v-flex>
        <v-flex xs12>
          <v-card-title class="title font-weight-medium">{{ $t('title.address') }}:</v-card-title>
        </v-flex>
        <v-flex xs12>
          <p class="break-string">{{ address - QR }}</p>
        </v-flex>
      </v-layout>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import VueQr from 'vue-qr'

@Component({
  components: {
    VueQr
  },
  props: {
    addressQR: {
      type: String
    },
    large: {
      type: Boolean,
      deafult: false
    }
  }
})
export default class AppAddressQR extends Vue {
  addressQR: string
  data() {
    return {
      dialog: false
    }
  }
  get getQR() {
    if (this.addressQR) {
      return this.addressQR.toLowerCase()
    }
    return null
  }
}
</script>
