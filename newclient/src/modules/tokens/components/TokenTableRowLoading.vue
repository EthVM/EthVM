<template>
    <v-layout>
        <!--
        =====================================================================================
          Mobile (XS-SM)
        =====================================================================================
      -->
        <v-flex xs12 hidden-md-and-up>
            <div class="table-row-loading-mobile mr-1 ml-1">
                <v-layout grid-list-xs row wrap align-center justify-start fill-height class="pr-2 pl-2">
                    <v-flex xs2>
                        <div class="token-image-mobile">
                            <v-img :src="require('@/assets/icon-token.png')" contain />
                        </div>
                    </v-flex>
                    <v-flex xs8>
                        <div class="table-row-loading mb-1"></div>
                        <div class="table-row-loading mb-1"></div>
                        <div class="table-row-loading mb-1"></div>
                        <div class="table-row-loading"></div>
                    </v-flex>
                    <v-flex xs2>
                        <div class="table-row-loading loading-token-button"></div>
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
            <v-layout grid-list-xs row align-center justify-start fill-height class="pr-3 pt-1">
                <v-flex sm1>
                    <div class="token-image">
                        <v-img :src="require('@/assets/icon-token.png')" contain />
                    </div>
                </v-flex>
                <v-flex sm3>
                    <div class="table-row-loading"></div>
                </v-flex>
                <v-flex sm2>
                    <div class="table-row-loading ml-2"></div>
                </v-flex>
                <v-flex sm2>
                    <div class="table-row-loading"></div>
                </v-flex>
                <v-flex sm2>
                    <div class="table-row-loading"></div>
                </v-flex>
                <v-flex sm2>
                    <div class="table-row-loading"></div>
                </v-flex>
            </v-layout>
            <v-divider class="mb-1 mt-1" />
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class TokenTableRowLoading extends Vue {}
</script>

<style scoped lang="css">
.table-row-loading {
    margin: 1px;
}
.table-row-loading-mobile {
    border: 1px solid #b4bfd2;
    padding: 10px 0px 10px 0px;
}
.loading-token-button {
    height: 2em;
}
</style>
