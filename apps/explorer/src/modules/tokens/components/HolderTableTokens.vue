<template>
  <div>
    <!-- Table Header -->
    <v-card color="info" flat class="white--text pl-3 pr-1 mt-2 mb-2" height="40px">
      <v-layout align-center justify-start row fill-height pr-3>
        <v-flex xs6 sm8 md5>
          <h5>{{ $t('title.address') }}</h5>
        </v-flex>
        <v-flex hidden-sm-and-down md2>
          <h5>{{ $t('tableHeader.quantity') }}</h5>
        </v-flex>
        <v-flex hidden-sm-and-down md2>
          <h5>{{ $t('tableHeader.percentage') }}</h5>
        </v-flex>
      </v-layout>
    </v-card>
    <!-- End Table Header -->

    <!-- Start Rows -->
    <v-card color="white" v-for="holder in holders" class="transparent" flat :key="holder.address">
      <v-layout align-center justify-start row fill-height pr-3>

        <!-- Column 1 -->
        <v-flex xs6 sm8 md5>
          <router-link class="primary--text text-truncate font-italic psmall pb-0 ml-2" :to="'/address/' + holder.address">
            {{ holder.address }}
          </router-link>
        </v-flex>
        <!-- End Column 1 -->

        <!-- Column 2 -->
        <v-flex hidden-sm-and-down md2>
          <p class="mb-0 ml-2">{{ holder.balance }}</p>
        </v-flex>
        <!-- End Column 2 -->

        <!-- Column 3 -->
        <v-flex hidden-sm-and-down md2>
          <p class="mb-0 ml-2">{{ holder.share }}%</p>
        </v-flex>
        <!-- End Column 3 -->

      </v-layout>
      <v-divider class="mb-2" />
    </v-card>
    <!-- End Rows -->

  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class TableTokens extends Vue {
  @Prop(Array) holders: Array<any>
}
</script>
