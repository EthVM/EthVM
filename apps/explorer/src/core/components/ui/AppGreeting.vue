<template>
  <v-dialog v-if="greet" v-model="dialog" width="500">
    <v-card>
      <canvas id="animate"> </canvas>
      <v-card-title class="headline" primary-title>
        {{ $t('message.welcome.title') }}
      </v-card-title>
      <v-card-text>
        {{ $t('message.welcome.text1') }} <a :href="'mailto:' + supportEmail">{{ supportEmail }}</a> {{ $t('message.welcome.text2') }}
      </v-card-text>

      <v-card-actions>
        <v-layout align-center justify-center row fill-height>
          <v-btn color="secondary" depressed class="text-capitalize mb-4" @click="removeDialog">
            {{ $t('message.welcome.btn') }}
          </v-btn>
        </v-layout>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import storePack from 'store'
import confetti from 'canvas-confetti'

@Component
export default class AppGreeting extends Vue {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop(Boolean) greet!: boolean

  /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

  dialog = true
  supportEmail = 'support@ethvm.com'

  /*
  ===================================================================================
    Lifecycle
  ===================================================================================
  */

  mounted() {
    setTimeout(() => {
      this.createAnimation()
    }, 200)
  }

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  removeDialog(): void {
    this.dialog = false
    storePack.set('notFirstTimeVisit', true)
  }

  createAnimation(): void {
    const myCanvas: any = document.getElementById('animate')
    const colors = ['#6270fc', '#92cce1', '#fed9a1', '#fe8778', '#00b173', '#fe1377', '#eea66b']
    myCanvas.confetti =
      myCanvas.confetti ||
      confetti.create(myCanvas, {
        resize: true
      })

    myCanvas.confetti({
      particleCount: 100,
      spread: 70,
      origin: {
        y: 1
      },
      colors: colors
    })
  }
}
</script>

<style scoped lang="css">
canvas {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
