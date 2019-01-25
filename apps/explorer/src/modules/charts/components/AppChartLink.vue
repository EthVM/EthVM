<template>
  <v-card flat transparent>
    <v-layout row>
      <v-flex xs8 pb-0>
        <v-card-title class="title font-weight-bold ">{{ title }}</v-card-title>
      </v-flex>
      <v-flex xs4 pb-0 mr-2>
        <v-btn flat color="secondary" class="text-capitalize" :to="'/chart/' + chartId">{{ $t('bttn.more') }} <v-icon right>fas fa-angle-right</v-icon></v-btn>
      </v-flex>
    </v-layout>
    <v-img :src="require('@/assets/chart.png')" contain class="ma-1"></v-img>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class AppChartLink extends Vue {
  @Prop({ type: String, required: true }) title!: string
  @Prop({ type: String, required: true }) chartId!: string
}
</script>
