<template>
  <v-card flat class="pa-5">
    <v-card-text class="error--text text-xs-center body-2"> {{ $t('message.error')}}</v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'errorNoData',
  data() {
    return {}
  }
})
