<template>
  <div>
    <div class="hidden-xs-only">
      <v-layout grid-list-xs row align-center justify-space-between fill-height class="pl-2 pr-3">
        <v-flex sm4 mr-1>
          <v-flex xs12 class="table-row-loading"></v-flex>
        </v-flex>
        <v-flex sm4>
          <v-flex xs12 class="table-row-loading"></v-flex>
        </v-flex>
        <v-flex sm2 mr-1>
          <v-flex xs12 class="table-row-loading"></v-flex>
        </v-flex>
        <v-flex sm2>
          <v-flex xs12 class="table-row-loading"></v-flex>
        </v-flex>
      </v-layout>
      <v-divider class="mb-2 mt-2" />
    </div>
    <div class="hidden-sm-and-up">
      <div class="table-row-mobile">
        <v-layout grid-list-xs row wrap align-center justify-start fill-height class="pa-2">
          <v-flex xs5>
            <div class="table-row-loading"></div>
          </v-flex>
          <v-flex xs12>
            <div class="table-row-loading"></div>
          </v-flex>
          <v-flex xs12>
            <div class="table-row-loading"></div>
          </v-flex>
          <v-flex xs5>
            <div class="table-row-loading"></div>
          </v-flex>
        </v-layout>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class TableAddressContractsRowLoading extends Vue {}
</script>

<style scoped lang="css">
.table-row-loading {
  margin: 1px;
}
.table-row-mobile {
  border: 1px solid #b4bfd2;
}
</style>
