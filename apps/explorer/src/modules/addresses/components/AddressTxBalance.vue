<template>
  <v-tooltip top content-class="more-info-tooltip" v-model="info">
    <template v-slot:activator="{ on }">
      <v-btn icon small class="more-info-btn" v-on="on" @click="info = !info">
        <v-icon small>fa fa-ellipsis-h</v-icon>
      </v-btn>
    </template>
    <v-card color="white" flat>
      <v-card-title
        v-if="tooltipInfo.status"
        class="txSuccess--text pa-1 body-2"
      >{{ $t('tx.success-long') }}</v-card-title>
      <v-card-title v-else class="txFail--text pa-1 body-2">{{ $t('tx.failed-long') }}</v-card-title>
      <!-- Before Balance -->
      <v-layout row align-center>
        <v-flex grow pa-1>
          <p>{{ $t('common.balance-before') }}</p>
        </v-flex>
        <v-flex shrink pa-1>
          <p class="text-xs-right">{{tooltipInfo.balBefore}} {{ $t('common.eth') }}</p>
        </v-flex>
      </v-layout>
      <!-- Value Sent -->
      <v-layout row align-center>
        <v-flex grow pa-1>
          <p>{{ getTooltipValueString() }}:</p>
        </v-flex>
        <v-flex shrink pa-1>
          <p
            v-if="tooltipInfo.status"
            class="text-xs-right"
          >{{tooltipInfo.value}} {{ $t('common.eth') }}</p>
          <p v-else class="text-xs-right info--text">0 {{ $t('common.eth') }}</p>
        </v-flex>
      </v-layout>
      <!-- Tx Fee -->
      <v-layout v-if="tooltipInfo.type != 'in'" row align-center>
        <v-flex grow pa-1>
          <p>{{ $tc('tx.fee', 1) }}:</p>
        </v-flex>
        <v-flex shrink pa-1>
          <p
            class="text-xs-right"
          >- {{tooltipInfo.fee}} {{ $t('common.eth') }}</p>
        </v-flex>
      </v-layout>
      <v-divider class="mb-2 mt-2" />
      <!-- Balance After -->
      <v-layout row align-center>
        <v-flex grow pa-1>
          <p>{{ $t('common.balance-after') }}</p>
        </v-flex>
        <v-flex shrink pa-1>
          <p class="text-xs-right">{{tooltipInfo.balAfter}} {{ $t('common.eth') }}</p>
        </v-flex>
      </v-layout>
    </v-card>
  </v-tooltip>
</template>


<script lang="ts">
import { StringConcatMixin } from '@app/core/components/mixins'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { TranslateResult } from 'vue-i18n'
import { AdrTxBalance } from '@app/core/components/props'

@Component
export default class AddressTxBalance extends Vue {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

  info = false

  @Prop(Object) tooltipInfo!: AdrTxBalance

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  getValueColor(): string {
    return !this.tooltipInfo.status || this.tooltipInfo.type === 'self' ? 'grey--text' : 'black--text'
  }


  getTooltipValueString(): TranslateResult {
    if (this.tooltipInfo.status) {
      return this.tooltipInfo.type === 'in' ? this.$tc('tooltip.value-recieved', 1) : this.$tc('tooltip.value-sent', 1)
    }

    return this.tooltipInfo.type === 'in' ? this.$tc('tooltip.value-recieved', 2) : this.$tc('tooltip.value-sent', 2)
  }

}
</script>


<style scoped lang="css">
.table-row-mobile {
  border: 1px solid #b4bfd2;
}

.tx-type-dsk {
  min-width: 100px;
}

.more-info-btn {
  color: #6270fc;
  margin: 0px;
}
.more-info-btn:hover {
  color: white;
  background-color: #b4bfd2;
}

.more-info-tooltip {
  background-color: white;
  border: 1px solid #b4bfd2;
  opacity: 1 !important;
  min-width: 280px;
}
</style>
