<template>
  <v-tooltip bottom>
    <template #activator="data">
      <v-icon v-on="data.on" dark small>fa fa-question-circle info--text</v-icon>
    </template>
    <span>{{ text }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class AppTooltip extends Vue {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop(String) text!: string
}
</script>
