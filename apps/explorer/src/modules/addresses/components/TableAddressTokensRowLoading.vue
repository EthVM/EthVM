<template>
  <v-card flat white>
    <v-layout>
      <!--
        =====================================================================================
          Mobile  (xs)
        =====================================================================================
      -->
      <v-flex xs12 hidden-sm-and-up>
        <div class="token-mobile">
          <v-layout grid-list-xs row wrap align-center justify-start fill-height pa-1>
            <v-flex xs2>
              <v-layout row align-center justify-center pa-2>
                <div class="token-image-mobile">
                  <v-img :src="require('@/assets/icon-token.png')" contain />
                </div>
              </v-layout>
            </v-flex>
            <v-flex>
              <v-layout row wrap align-center justify-start pr-2>
                <v-flex xs10 :xs12="isRopsten" pa-1>
                  <div class="table-row-loading"></div>
                </v-flex>
                <v-flex xs2 :xs12="isRopsten" pa-1>
                  <div class="table-row-loading"></div>
                </v-flex>
                <v-flex v-if="!isRopsten" xs12 pa-1>
                  <div class="table-row-loading"></div>
                  <div class="table-row-loading"></div>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </div>
      </v-flex>
      <!--
        =====================================================================================
          Desktop (SM-LG)
        =====================================================================================
       -->
      <v-flex hidden-xs-only sm12>
        <!-- Standard layout -->
        <v-layout grid-list-xs row wrap align-center justify-start fill-height class="pl-2 pr-2 pt-2">
          <v-flex sm4 :sm6="isRopsten">
            <v-layout grid-list-xs row align-center justify-start fill-height pl-2 pr-2>
              <div class="token-image">
                <v-img :src="require('@/assets/icon-token.png')" contain />
              </div>
              <v-flex class="table-row-loading" />
            </v-layout>
          </v-flex>
          <v-flex sm3 :sm6="isRopsten">
            <div class="table-row-loading"></div>
          </v-flex>
          <v-flex v-if="!isRopsten" sm3>
            <div class="table-row-loading"></div>
          </v-flex>
          <v-flex v-if="!isRopsten" sm2>
            <div class="table-row-loading"></div>
          </v-flex>
        </v-layout>
        <v-divider class="mb-2 mt-2" />
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class TokenTableRowLoading extends Vue {
  @Prop(Boolean) isRopsten?: boolean
}
</script>

<style scoped lang="css">
.table-row-loading {
  margin: 1px;
}
.token-mobile {
  border: 1px solid #b4bfd2;
  padding: 10px 0px 10px 0px;
  height: 68px;
}
</style>
