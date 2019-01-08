<template>
  <v-layout wrap row align-center justify-start pb-1>
    <v-flex xs12 v-if="listType != 'block'" pr-4 pl-4>
      <v-layout row wrap align-center justify-start>
        <v-card-title class="title font-weight-bold pl-4">{{ title }}</v-card-title>
      </v-layout>
    </v-flex>
    <!-- WIP <v-flex xs12 v-else>
        <v-layout v-if="!isUncle" wrap row align-center justify-start pb-1>
    <v-flex xs3 sm2 md1>
      <v-layout align-center justify-start>
        <v-btn flat color="primary" class="black--text" icon :to="previousBlock()">
          <v-icon>fas fa-angle-left</v-icon>
        </v-btn>
      </v-layout>
    </v-flex>
    <v-flex xs6 sm8 md10 pl-0>
      <v-layout row wrap align-center justify-start pl-0>
        <v-card-title class="title font-weight-bold">{{ $t('title.blockDetail') }}</v-card-title>
        <v-dialog v-if="hasUncles" v-model="dialog" max-width="700">
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
    <v-flex v-if="mined" xs3 sm2 md1>
      <v-layout align-center justify-end>
        <v-btn flat color="primary" class="black--text" icon :to="nextBlock()">
          <v-icon>fas fa-angle-right</v-icon>
        </v-btn>
      </v-layout>
    </v-flex>
  </v-layout>
    </v-flex>-->
  </v-layout>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class AppListTitle extends Vue {
  @Prop(String) listType!: string
  @Prop(Number) blockNumber!: number

  data() {
    return {
      titles: {
        tx: this.$i18n.t('title.txDetail'),
        block: this.$i18n.t('title.blockDetail'),
        uncle: this.$i18n.t('title.uncleDetail')
      }
    }
  }

  //Methods:
  setView() {
    this.showMore = !this.showMore
  }

  //Computed:
  get title() {
    return this.titles[this.listType] || this.$i18n.t('title.uncleDetail')
  }
}
</script>

