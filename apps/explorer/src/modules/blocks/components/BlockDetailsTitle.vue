<template>
  <v-flex xs12>
    <v-layout row wrap align-center justify-start mt-1 mb-1>
      <!-- Previous Block -->
      <v-flex xs2 sm1>
        <v-layout v-if="prevBlock != ''" align-center justify-start>
          <v-btn flat color="primary" class="black--text" icon :to="prevBlock"> <v-icon>fas fa-angle-left</v-icon> </v-btn>
        </v-layout>
      </v-flex>
      <!-- Title -->
      <v-flex xs8 sm10 pl-0 pr-0>
        <v-layout row wrap align-center justify-start>
          <v-card-title class="title font-weight-bold pa-1">{{ title }}</v-card-title>
          <v-dialog v-if="hasUncles" v-model="dialog" max-width="700">
            <template v-slot:activator="{ on }">
              <v-btn round outline slot="activator" color="primary" class="text-capitalize"  v-on="on" small>
                {{$tc('uncle.name', unclesPlural) }}
                <v-icon right>fa fa-angle-right</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-card-title class="title font-weight-bold">{{ $tc('uncle.name', unclesPlural) }}:</v-card-title>
              <v-divider class="lineGrey"/>
              <v-list>
                <v-list-tile v-for="(uncle, index) in uncles" :key="index">
                  <v-layout row justify-start align-center fill-height>
                    <v-card-title class="info--text p-0" >{{ $t('common.hash') }}:</v-card-title>
                    <app-hash-concat :hash=" uncle" :link="'/uncle/' + uncle" />
                  </v-layout>
                </v-list-tile>
              </v-list>
            </v-card>
          </v-dialog>
        </v-layout>
      </v-flex>
      <!-- Next Block -->
      <v-flex v-if="nextBlock != ''" xs2 sm1>
        <v-layout align-center justify-end>
          <v-btn flat color="primary" class="black--text" icon :to="nextBlock"> <v-icon>fas fa-angle-right</v-icon> </v-btn>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<script lang="ts">
import AppHashConcat from '@app/core/components/ui/AppHashConcat.vue'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  components:{
    AppHashConcat
  }
})
export default class BlockDetailsTitle extends Vue {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop(String) nextBlock!: string
  @Prop(String) prevBlock!: string
  @Prop(Array) uncles!: string[]

  /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

  dialog = false

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  get title(): string {
    return this.$i18n.t('block.detail').toString()
  }

  get hasUncles(): boolean {
    return !!this.uncles && this.uncles.length > 0
  }

  get unclesPlural(): number {
    return !this.uncles && this.uncles.length > 1 ? 2 : 1
  }
}
</script>
