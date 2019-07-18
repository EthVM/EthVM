<template>
  <div>
    <v-layout align-center justify-space-between row wrap fill-height pb-1 pr-2 pl-2>
      <v-flex xs6>
        <v-card-title class="title font-weight-bold pl-1">{{ title }}</v-card-title>
      </v-flex>
      <v-spacer />
      <v-flex shrink>
          <v-btn
            outline
            color="secondary"
            class="text-capitalize ma-0"
            :to="pageLink"
          >{{ $t('btn.view-all') }}</v-btn>
      </v-flex>
    </v-layout>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class AppTableTitle extends Vue {
  /*
    ===================================================================================
      Props
    ==================================================================================
  */

  @Prop(String) title?: string
  @Prop(String) pageLink?: string

}
</script>

