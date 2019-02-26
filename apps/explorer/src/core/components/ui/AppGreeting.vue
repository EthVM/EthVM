<template>
  <v-dialog v-if="greet" v-model="dialog" width="500">
    <v-card>
      <v-card-title class="headline" primary-title>
        {{$t('message.welcome.title')}}
      </v-card-title>
      <v-card-text>
        {{$t('message.welcome.text1')}} <a :href="'mailto:' + supportEmail">{{ supportEmail }}</a> {{$t('message.welcome.text2')}}
      </v-card-text>
      <v-card-actions>
        <v-layout align-center justify-center row fill-height >
        <v-btn color="secondary" depressed class="text-capitalize mb-4" @click="removeDialog">
          {{$t('message.welcome.btn')}}
        </v-btn>
        </v-layout>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
  import {
    Vue,
    Component,
    Prop
  } from 'vue-property-decorator'
  import storePack from 'store';

  @Component
  export default class AppGreeting extends Vue {
    @Prop(Boolean) greet!: boolean
    dialog = true
    supportEmail = 'support@ethvm.com'

    //Methods:
    removeDialog(): void {
      this.dialog = false
      storePack.set('notFirstTimeVisit', true);
    }
  }
</script>

<style scoped lang="css">

</style>
