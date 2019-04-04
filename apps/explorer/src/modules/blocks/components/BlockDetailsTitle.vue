<template>
  <v-flex xs12>
    <v-layout row wrap align-center justify-start>
      <!-- Previous Block -->
      <v-flex xs3 sm2 md1>
        <v-layout v-if="prevBlock != ''" align-center justify-start>
          <v-btn flat color="primary" class="black--text" icon :to="prevBlock"> <v-icon>fas fa-angle-left</v-icon> </v-btn>
        </v-layout>
      </v-flex>
      <!-- Title -->
      <v-flex xs6 sm8 md10 pl-0>
        <v-layout row wrap align-center justify-start pl-0>
          <v-card-title class="title font-weight-bold">{{ title }}</v-card-title>
          <v-dialog v-if="hasUncles" v-model="dialog" max-width="700">
            <template v-slot:activator="{ on }">
              <v-btn round outline slot="activator" color="primary" class="text-capitalize"  v-on="on" small>
                {{ $tc('uncle.name', 2) }}
                <v-icon right>fa fa-angle-right</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-card-title class="title font-weight-bold">{{ $t('uncle.name', 2) }}:</v-card-title>
              <v-divider class="lineGrey"></v-divider>
              <v-list>
                <v-list-tile v-for="(uncle, index) in uncles" :key="index">
                  <v-layout row justify-start align-center fill-height>
                    <v-card-title class="info--text pr-0 pl-0">{{ $t('common.hash') }}:</v-card-title>
                    <v-card-text class="text-truncate font-mono">
                      <router-link :to="'/uncle/' + uncle">{{ uncle }}</router-link>
                    </v-card-text>
                  </v-layout>
                </v-list-tile>
              </v-list>
            </v-card>
          </v-dialog>
        </v-layout>
      </v-flex>
      <!-- Next Block -->
      <v-flex v-if="nextBlock != ''" xs3 sm2 md1>
        <v-layout align-center justify-end>
          <v-btn flat color="primary" class="black--text" icon :to="nextBlock"> <v-icon>fas fa-angle-right</v-icon> </v-btn>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
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
}
</script>
