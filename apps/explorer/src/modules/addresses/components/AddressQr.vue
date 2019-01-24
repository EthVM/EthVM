<template>
  <v-dialog v-model="dialog" max-width="400">
    <v-btn flat color="black" fab slot="activator" class="black--text ma-0" large> <v-icon>fas fa-qrcode</v-icon> </v-btn>
    <v-card>
      <v-layout column align-center justify-center pa-2>
        <v-flex xs12> <vue-qr v-if="address" :text="serialize" :size="260" /> </v-flex>
        <v-flex xs12>
          <v-card-title class="title font-weight-medium">{{ $t('title.address') }}:</v-card-title>
        </v-flex>
        <v-flex xs12>
          <p class="break-string">{{ address }}</p>
        </v-flex>
      </v-layout>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import VueQr from 'vue-qr'

@Component({
  components: {
    VueQr
  }
})
export default class AddressQR extends Vue {
  @Prop({ type: String }) address!: string
  @Prop({ type: Boolean, default: false }) large!: boolean

  dialog: boolean = false

  get serialize() {
    return this.address
  }
}
</script>
