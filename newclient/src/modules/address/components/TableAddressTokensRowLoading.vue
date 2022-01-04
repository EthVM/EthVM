<template>
    <v-layout>
        <!--
        =====================================================================================
          Mobile  (sm)
        =====================================================================================
      -->
        <v-flex xs12 hidden-md-and-up>
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
                            <v-flex :xs12="isRopsten" xs10 pa-1>
                                <div class="table-row-loading"></div>
                            </v-flex>
                            <v-flex :xs12="isRopsten" xs2 pa-1>
                                <div class="table-row-loading"></div>
                            </v-flex>
                            <v-flex v-if="!isRopsten" xs12 pa-1>
                                <div class="table-row-loading mb-2"></div>
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
        <v-flex hidden-sm-and-down sm12>
            <!-- Standard layout -->
            <v-layout grid-list-xs row wrap align-center justify-start fill-height class="pt-2">
                <v-flex :sm6="isRopsten" sm4 class="pt-0 pb-0">
                    <v-layout grid-list-xs row align-center justify-start fill-height pl-2 pr-2>
                        <div class="token-image">
                            <v-img :src="require('@/assets/icon-token.png')" contain />
                        </div>
                        <v-flex class="table-row-loading" />
                    </v-layout>
                </v-flex>
                <v-flex :sm6="isRopsten" sm3 class="pt-0 pb-0">
                    <div
                        :class="{ 'table-row-loading-desktop': $vuetify.breakpoint.name !== 'xs' && $vuetify.breakpoint.name !== 'sm' }"
                        class="table-row-loading"
                    ></div>
                </v-flex>
                <v-flex v-if="!isRopsten" sm3 class="pt-0 pb-0">
                    <div
                        :class="{ 'table-row-loading-desktop': $vuetify.breakpoint.name !== 'xs' && $vuetify.breakpoint.name !== 'sm' }"
                        class="table-row-loading"
                    ></div>
                </v-flex>
                <v-flex v-if="!isRopsten" sm2 class="pt-0 pb-0">
                    <div
                        :class="{ 'table-row-loading-desktop': $vuetify.breakpoint.name !== 'xs' && $vuetify.breakpoint.name !== 'sm' }"
                        class="table-row-loading"
                    ></div>
                </v-flex>
            </v-layout>
            <v-divider class="mb-2 mt-2" />
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class TableTokensRowLoading extends Vue {
    @Prop(Boolean) isRopsten?: boolean
}
</script>

<style scoped lang="css">
.table-row-loading {
    margin: 1px;
}
.table-row-loading-desktop {
    height: 16px !important;
}
.token-mobile {
    border: 1px solid #b4bfd2;
    padding: 10px 0px 10px 0px;
}
</style>
