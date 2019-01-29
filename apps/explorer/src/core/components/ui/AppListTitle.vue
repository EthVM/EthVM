<template>
  <v-layout wrap row align-center justify-start pb-1>
    <!-- Ttransaction/Uncles -->
    <v-flex xs12 v-if="listType != 'block'" pr-4 pl-4>
      <v-card-title class="title font-weight-bold pl-4">{{ title }}</v-card-title>
    </v-flex>
    <!-- End Ttransaction/Uncles -->
    <!-- Block -->
    <v-flex xs12 v-else>
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
            <v-card-title class="title font-weight-bold">{{ titles.block }}</v-card-title>
            <v-dialog v-if="hasUncles " v-model="dialog" max-width="700">
              <v-btn round outline slot="activator" color="primary" class="text-capitalize" small>
                {{ $t('title.uncles') }}
                <v-icon right>fa fa-angle-right</v-icon>
              </v-btn>
              <v-card>
                <v-card-title class="title font-weight-bold">{{ $t('title.uncles') }}:</v-card-title>
                <v-divider class="lineGrey"></v-divider>
                <v-list>
                  <v-list-tile v-for="(uncle, index) in uncles" :key="index">
                    <v-layout row justify-start align-center fill-height>
                      <v-card-title class="info--text pr-0 pl-0">{{ $t('common.hash') }}:</v-card-title>
                      <v-card-text class="text-truncate">
                        <router-link :to="'/uncle/' + uncles[index]">{{ uncles[index] }}</router-link>
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
    <!-- End Block -->
  </v-layout>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { BlockDetailsTitle } from '@app/core/components/props'

@Component
export default class AppListTitle extends Vue {
  @Prop(String) listType!: string
  @Prop(String) nextBlock!: string
  @Prop(String) prevBlock!: string
  @Prop(Boolean) mined!: boolean
  @Prop(Array) uncles!: string[]

  dialog = false

  //Computed:
  get title():string {
    console.log("hello")
    return titles[this.listType] || this.titles[0]
  }

  get titles() {
    return  {
      tx: this.$i18n.t('title.txDetail'),
      block: this.$i18n.t('title.blockDetail'),
      uncle: this.$i18n.t('title.uncleDetail')
    }
  }

  get hasUncles(): boolean {
    return this.mined && this.uncles
  }
}
</script>
