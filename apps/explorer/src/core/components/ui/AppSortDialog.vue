<template>
<v-layout row wrap align-center justify-center >
   <p class="info--text">{{ $t('common.sort') }}:</p>
  <v-dialog v-model="dialog" full-width>
    <template v-slot:activator="{ on }">
      <v-btn flat class="box-border sort-btn text-capitalize ma-1 pa-1" v-on="on">
        <div class="sort-btn-content ">
          <p class="text-xs-left">{{ btnText }}</p>
          <v-icon class="primary--text" small>{{ btnIcon }}</v-icon>
        </div>
      </v-btn>
    </template>
    <v-card>
      <v-layout row class="pl-3 pr-3 pt-3">
        <v-flex>
          <v-card-title class="title font-weight-bold ">{{ $t('common.sort') }}:</v-card-title>
        </v-flex>
        <v-spacer />
        <v-flex xs1 mr-3>
          <v-btn icon @click="dialog = false">
            <v-icon class="info--text ">clear</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
      <v-divider class="lineGrey"></v-divider>
      <v-list class="pb-3">
        <v-list-tile v-for="(item, index) in items" :key="index" class="pl-0" @click="setSelected(index)">
          <v-layout row justify-start align-center fill-height :class="[selected === index ? 'primary--text' : 'info--text']">
            <v-flex xs5>
              <v-card-title>{{ item.text }}:</v-card-title>
            </v-flex>
            <v-flex shrink>
              <v-card-title>{{ getSortValue(index) }}</v-card-title>
            </v-flex>
            <v-flex shrink>
              <v-icon>{{ getIcon(index) }}</v-icon>
            </v-flex>
          </v-layout>
        </v-list-tile>
      </v-list>
    </v-card>
  </v-dialog>
</v-layout>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { SortItem } from '@app/core/components/props'
import { throwError } from 'rxjs'
import { TranslateResult } from 'vue-i18n'

@Component
export default class AppSortDialog extends Vue {
  /*
  ===================================================================================
    Prop
  ===================================================================================
  */
  @Prop(Array) items!: SortItem[]
  @Prop(Number) selected!: number
  @Prop(String) dialogId!: string

  /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */
  dialog: boolean = false

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  // Should be defined in parent: 'setSort(index: number)
  setSelected(_index: number): void {
    this.$emit('setSort', _index)
  }

  //Return Text Color
  selectedClass(_index: number) {
    return this.selected === _index ? 'info--text' : 'black--text'
  }

  //Return correct Icon
  getIcon(_index: number): string {
    return this.items[_index].value.includes('low') ? 'fas fa-sort-amount-up' : 'fas fa-sort-amount-down'
  }

  //Return item Value
  getSortValue(_index: number): TranslateResult {
    return this.items[_index].value.includes('low') ? this.$t('filter.low') : this.$t('filter.high')
  }

  /*
  ===================================================================================
    Computed
  ===================================================================================
  */

  get btnText(): TranslateResult {
    return this.items[this.selected].text
  }

  get btnIcon(): string {
    return this.items[this.selected].value.includes('low') ? 'fas fa-sort-amount-up' : 'fas fa-sort-amount-down'
  }
}
</script>

<style lang="css">

.sort-btn {
  width: auto;
  height: 30px;
}
.sort-btn-content {
  display: grid;
  width:80%;
  grid-template-columns: 90% 10%;
}

.box-border{
  border: solid 1px #b4bfd2;
  border-radius: 20px;
  height: 40px;
}
</style>
