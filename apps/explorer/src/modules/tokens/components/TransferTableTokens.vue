<template>
  <div>
    <!-- Table Header -->
    <v-card color="info" flat class="white--text pl-3 pr-1 mt-2 mb-2" height="40px">
      <v-layout align-center justify-start row fill-height pr-3>
        <v-flex xs6 sm8 md5>
          <h5>{{ $t('tableHeader.txN') }}</h5>
        </v-flex>
        <v-flex hidden-sm-and-down md2>
          <h5>{{ $t('tableHeader.age') }}</h5>
        </v-flex>
        <v-flex hidden-sm-and-down md2>
          <h5>{{ $t('tableHeader.quantity') }}</h5>
        </v-flex>
      </v-layout>
    </v-card>
    <!-- End Table Header -->

    <!-- Start Rows -->
    <v-card color="white" v-for="tx in transfers" class="transparent" flat :key="tx.getHash()">
      <v-layout align-center justify-start row fill-height pr-3>
        <!-- Column 1 -->
        <v-flex xs6 sm8 md5>
          <v-flex d-flex xs12 pb-2>
            <router-link class="primary--text text-truncate font-italic psmall" :to="'/tx/' + tx.getHash()">{{ tx.getHash() }}</router-link>
          </v-flex>
          <v-flex xs12 pt-0>
            <v-layout row pl-2>
              <p class="text-truncate info--text mb-0">
                {{ $t('tx.from') }}:
                <router-link :to="'/address/' + tx.getFrom().toString()" class="secondary--text font-italic font-weight-regular">
                  {{ tx.getFrom().toString() }}
                </router-link>
              </p>
              <v-icon class="fas fa-arrow-right primary--text pl-1 pr-2 pb-1" small></v-icon>
              <p class="text-truncate info--text font-weight-thin mb-0" v-if="!tx.getContractAddress().isEmpty()">
                {{ $t('tx.contract') }}:
                <router-link class="secondary--text font-italic font-weight-regular" :to="'/address/' + tx.getContractAddress().toString()">
                  {{ tx.getContractAddress().toString() }}
                </router-link>
              </p>
              <p class="text-truncate info--text font-weight-thin mb-0" v-else>
                <strong>{{ $t('tx.to') }}:</strong>
                <router-link class="secondary--text font-italic font-weight-regular" :to="'/address/' + tx.getTo().toString()">
                  {{ tx.getTo().toString() }}
                </router-link>
              </p>
            </v-layout>
          </v-flex>
        </v-flex>
        <!-- End Column 1 -->

        <!-- Column 2 -->
        <v-flex hidden-sm-and-down md2>
          <p>{{ tx.getTimestamp() }}</p>
        </v-flex>
        <!-- End Column 2 -->

        <!-- Column 3 -->
        <v-flex hidden-sm-and-down md2>
          <p>{{ tx.getValue().toEth() }}</p>
        </v-flex>
        <!-- End Column 3 -->
      </v-layout>
      <v-divider class="mb-2 mt-2" />
    </v-card>
    <!-- End Rows -->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Tx } from '@app/core/models'

@Component
export default class TableTokens extends Vue {
  @Prop(Array) transfers: Tx[]
}
</script>
