<template>
  <v-card color="white" flat class="pt-0 pb-2">
    <!-- Table Header -->
    <v-card color="primary" flat class="white--text pl-3 pr-1" height="40px">
      <v-layout align-center justify-start row fill-height pr-3>
        <v-flex xs9 sm9 md5 pl-3>
          <h5>{{ $t('tableHeader.txN') }}</h5>
        </v-flex>
        <v-flex xs3 sm2 md2>
          <h5>{{ $t('common.eth') }}</h5>
        </v-flex>
        <v-flex hidden-sm-and-down md2>
          <h5>{{ $t('gas.limit') }}</h5>
        </v-flex>
        <v-flex hidden-sm-and-down md2>
          <h5>{{ $t('common.gwei') }}</h5>
        </v-flex>
        <v-flex hidden-xs-only sm1>
          <h5>{{ $t('common.status') }}</h5>
        </v-flex>
      </v-layout>
    </v-card>
    <v-card flat id="scroll-target" style="max-height: 800px" class="scroll-y pt-0 pb-0">
      <v-layout column fill-height v-scroll:#scroll-target class="pt-1" style="margin-right: 1px">
        <v-flex xs12>
          <v-card v-if="transactions.length == 0" flat>
            <v-card-text class="text-xs-center secondary--text">{{ text }}</v-card-text>
          </v-card>
          <v-card v-else v-for="tx in transactions" class="transparent pb-1" flat :key="tx.getHash()">
            <v-layout grid-list-xs row wrap align-center justify-start fill-height pl-3 pr-2 pt-2 pb-1>
              <v-flex d-flex xs9 sm9 md5 pr-3>
                <v-layout row wrap align-center pb-1>
                  <v-flex d-flex xs12 pb-2>
                    <router-link class="primary--text text-truncate font-italic psmall" :to="'/tx/' + tx.getHash()">{{ tx.getHash() }}</router-link>
                  </v-flex>
                  <v-flex hidden-xs-and-down sm12 pt-0>
                    <v-layout row pl-2>
                      <p v-if="!getType(tx)" class="text-truncate info--text mb-0">
                        {{ $t('tx.from') }}:
                        <router-link :to="'/address/' + tx.getFrom().toString()" class="secondary--text font-italic font-weight-regular"
                          >{{ tx.getFrom().toString() }}
                        </router-link>
                      </p>
                      <p class="text-truncate info--text font-weight-thin mb-0" v-if="getType(tx) && !tx.getContractAddress().isEmpty()">
                        {{ $t('tx.contract') }}:
                        <router-link class="secondary--text font-italic font-weight-regular" :to="'/address/' + tx.getContractAddress().toString()"
                          >{{ tx.getContractAddress().toString() }}
                        </router-link>
                      </p>
                      <p class="text-truncate info--text font-weight-thin mb-0" v-if="getType(tx) && tx.getContractAddress().isEmpty()">
                        <strong>{{ $t('tx.to') }}:</strong>
                        <router-link class="secondary--text font-italic font-weight-regular" :to="'/address/' + tx.getTo().toString()"
                          >{{ tx.getTo().toString() }}
                        </router-link>
                      </p>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex d-flex xs3 sm2 md2 pr-0>
                <v-layout
                  align-center
                  row
                  pl-2
                  v-if="
                    !isShortValue(
                      tx
                        .getValue()
                        .toEth()
                        .toString()
                    )
                  "
                >
                  <p :class="[!getType(tx) ? 'success--text mb-0' : 'error--text mb-0']">{{ getShortValue(tx.getValue().toEth()) }}</p>
                  <v-tooltip bottom>
                    <v-icon slot="activator" small class="info--text text-xs-center ml-1">fa fa-question-circle</v-icon>
                    <span>{{
                      formatStr(
                        tx
                          .getValue()
                          .toEth()
                          .toString()
                      )
                    }}</span>
                  </v-tooltip>
                </v-layout>
                <p v-else :class="[!getType(tx) ? 'success--text mb-0 ' : 'error--text mb-0 ']">{{ tx.getValue().toEth() }}</p>
              </v-flex>
              <v-flex hidden-sm-and-down md2>
                <p class="black--text text-truncate mb-0">{{ tx.getGasUsed().toNumber() }}</p>
              </v-flex>
              <v-flex hidden-sm-and-down md2>
                <p class="text-truncate black--text mb-0">{{ tx.getGasPrice().toGWei() }}</p>
              </v-flex>
              <v-flex hidden-xs-only sm1>
                <v-icon v-if="tx.getStatus()" small class="txSuccess--text">fa fa-check-circle {{ log(tx) }}</v-icon>
                <v-icon v-else small class="txFail--text">fa fa-times-circle {{ log(tx) }}</v-icon>
              </v-flex>
            </v-layout>
            <v-divider />
          </v-card>
        </v-flex>
      </v-layout>
    </v-card>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop, Mixins } from 'vue-property-decorator'
import { StringConcatMixin } from '@app/core/components/mixins'

@Component
export default class TableAddressTxRow extends Mixins(StringConcatMixin) {
  @Prop({ type: String, required: true }) account!: string
  @Prop(Array) transactions!: any[]
  @Prop({ type: Number, default: 0 }) filter!: number
  @Prop({ type: Boolean, default: false }) type!: boolean

  // Methods
  getType(tx): boolean {
    return (
      tx
        .getFrom()
        .toString()
        .toUpperCase() === this.account.toUpperCase()
    )
  }

  log(tx) {}

  // Computed
  get text(): string {
    const mesg = [this.$i18n.t('message.txAll'), this.$i18n.t('message.txIn'), this.$i18n.t('message.txOut')]
    const penMesg = [this.$i18n.t('message.txPen'), this.$i18n.t('message.txPenIn'), this.$i18n.t('message.txPenOut')]
    if (!this.type) {
      return mesg[this.filter].toString()
    }

    return penMesg[this.filter].toString()
  }
}
</script>
