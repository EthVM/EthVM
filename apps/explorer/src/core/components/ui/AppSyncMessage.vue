<template>
  <v-card color="sync" flat>
    <v-layout row align-center justify-center fill-height>
      <v-card-title class="text-xs-center">{{ $t('message.sync') }}</v-card-title>
    </v-layout>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
@Component
export default class AppSyncMessage extends Vue {}
</script>
