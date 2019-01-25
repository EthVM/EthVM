<template>
  <v-layout row wrap justify-center mb-4>
    <v-flex xs12>
      <v-data-table
        :headers="headers"
        :items="tokens"
        :must-sort="true"
        :pagination.sync="sortBy"
        :custom-sort="customSort"
        class="elevation-1"
      >
        <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
        <template slot="items" slot-scope="props">
          <td>{{ props.item.name }}</td>
          <td class="">{{ props.item.price.rate }}</td>
          <td class="">{{ props.item.price.diff }}</td>
          <td class="">{{ props.item.volume }}</td>
          <td class="text-xs-right">{{ props.item.price.marketCapUsd }}</td>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class TableTokens extends Vue {
  @Prop(Array) tokens!: Array<Object>

  // See https://vuetifyjs.com/en/components/data-tables (pagination.sync) //
  sortBy = {
    descending: true,
    rowsPerPage: 10,
    sortBy: 'marketCap'
  }

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  /**
   * Handle the sorting of items within a Vuetify v-data-table.
   * See: https://vuetifyjs.com/en/components/data-tables (custom-sort)
   */
  customSort(items, index, isDescending) {
    items.sort((a, b) => {
      switch (index) {
        case 'marketCap':
          return isDescending ? b.price.marketCapUsd - a.price.marketCapUsd : a.price.marketCapUsd - b.price.marketCapUsd
        case 'price':
          return isDescending ? b.price.rate - a.price.rate : a.price.rate - b.price.rate
        case 'volume':
          return isDescending ? b.volume - a.volume : a.volume - b.volume
        case 'change':
          return isDescending ? b.price.diff - a.price.diff : a.price.diff - b.price.diff
      }
    })

    return items
  }

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  /**
   * Headers object required for Vuetify data table.
   * See: https://vuetifyjs.com/en/components/data-tables
   *
   * @return {Array} - Header values. See description.
   */
  get headers() {
    return [
      {
        text: this.$i18n.t('tableHeader.token'),
        align: 'left',
        sortable: false,
        value: 'name'
      },
      {
        text: this.$i18n.t('tableHeader.price'), 
        value: 'price'
      },
      {
        text: '%Change',
        value: 'change'
      },
      {
        text: 'Volume (24H)',
        value: 'volume'
      },
      {
        text: this.$i18n.t('tableHeader.marketCap'),
        value: 'marketCap',
        align: 'right'
      }
    ]
  }

  /**
   * Determines whether or not the tokens object has been loaded/populated
   *
   * @return {Boolean}
   */
  get isTokensLoading(): boolean {
    return this.tokens.length === 0
  }
}
</script>
