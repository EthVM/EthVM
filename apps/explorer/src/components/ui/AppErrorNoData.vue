<template>
  <v-card flat class="pa-5">
    <v-card-text class="error--text text-xs-center body-2"> {{ $t('message.error') }}</v-card-text>
  </v-card>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator'

@Component
export default class AppErrorNoData extends Vue {}
</script>
