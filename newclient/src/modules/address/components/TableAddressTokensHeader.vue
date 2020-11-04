<template>
    <div class="token-header-container">
        <!--
        =====================================================================================
          TRANSFERS HEADER
        =====================================================================================
        -->
        <v-layout v-if="isTransfers" align-center justify-start row fill-height>
            <v-flex md3>
                <v-layout
                    :class="[!isTransferSortActive(0) && !isTransferSortActive(1) ? 'inactive-sort' : '']"
                    grid-list-xs
                    row
                    align-center
                    justify-start
                    fill-height
                >
                    <h5 class="pl-3">{{ this.$tc('token.name', 1) }}</h5>
                    <v-flex d-flex align-center>
                        <v-layout align-start justify-right>
                            <v-btn
                                v-if="!loading && !isTransferSortActive(1)"
                                :class="[!isTransferSortActive(0) && !isTransferSortActive(1) ? 'inactive-btn' : '']"
                                flat
                                icon
                                @click="selectTransferFilter(0)"
                            >
                                <v-icon :class="[isTransferSortActive(0) ? 'white--text' : '']">fas fa-long-arrow-alt-up</v-icon>
                            </v-btn>
                            <v-btn v-if="!loading && isTransferSortActive(1)" flat icon @click="selectTransferFilter(1)">
                                <v-icon :class="[isTransferSortActive(1) ? 'white--text' : '']">fas fa-long-arrow-alt-down</v-icon>
                            </v-btn>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-spacer />
            <v-flex md3>
                <v-layout
                    :class="[!isTransferSortActive(2) && !isTransferSortActive(3) ? 'inactive-sort' : '']"
                    grid-list-xs
                    row
                    align-center
                    justify-start
                    fill-height
                >
                    <h5>{{ $t('common.amount') }}</h5>
                    <v-flex d-flex align-center>
                        <v-layout align-start justify-right>
                            <v-btn
                                v-if="!loading && !isTransferSortActive(2)"
                                :class="[!isTransferSortActive(3) && !isTransferSortActive(2) ? 'inactive-btn' : '']"
                                flat
                                icon
                                @click="selectTransferFilter(3)"
                            >
                                <v-icon :class="[isTransferSortActive(3) ? 'white--text' : '']">fas fa-long-arrow-alt-up</v-icon>
                            </v-btn>
                            <v-btn v-if="!loading && isTransferSortActive(2)" flat icon @click="selectTransferFilter(2)">
                                <v-icon :class="[isTransferSortActive(2) ? 'white--text' : '']">fas fa-long-arrow-alt-down</v-icon>
                            </v-btn>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex md2>
                <v-layout
                    :class="[!isTransferSortActive(4) && !isTransferSortActive(5) ? 'inactive-sort' : '']"
                    grid-list-xs
                    row
                    align-center
                    justify-start
                    fill-height
                >
                    <h5>{{ text }}</h5>
                    <v-flex d-flex align-center>
                        <v-layout align-start justify-right>
                            <v-btn
                                v-if="!loading && !isTransferSortActive(4)"
                                :class="[!isTransferSortActive(5) && !isTransferSortActive(4) ? 'inactive-btn' : '']"
                                flat
                                icon
                                @click="selectTransferFilter(5)"
                            >
                                <v-icon :class="[isTransferSortActive(5) ? 'white--text' : '']">fas fa-long-arrow-alt-up</v-icon>
                            </v-btn>
                            <v-btn v-if="!loading && isTransferSortActive(4)" flat icon @click="selectTransferFilter(4)">
                                <v-icon :class="[isTransferSortActive(4) ? 'white--text' : '']">fas fa-long-arrow-alt-down</v-icon>
                            </v-btn>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
        <!--
        =====================================================================================
          TOKENS HEADER
        =====================================================================================
        -->
        <v-layout v-else align-center justify-start row fill-height>
            <v-flex md4>
                <v-layout
                    :class="[!isTokenSortActive(0) && !isTokenSortActive(1) ? 'inactive-sort' : '']"
                    grid-list-xs
                    row
                    align-center
                    justify-start
                    fill-height
                >
                    <div class="token-image" />
                    <h5>{{ $t('token.tokenName') }}</h5>
                    <v-flex d-flex align-center>
                        <v-layout align-start justify-right>
                            <v-btn
                                v-if="!loading && !isTokenSortActive(1)"
                                :class="[!isTokenSortActive(0) && !isTokenSortActive(1) ? 'inactive-btn' : '']"
                                flat
                                icon
                                @click="selectTokenFilter(0)"
                            >
                                <v-icon :class="[isTokenSortActive(0) ? 'white--text' : '']">fas fa-long-arrow-alt-up</v-icon>
                            </v-btn>
                            <v-btn v-if="!loading && isTokenSortActive(1)" flat icon @click="selectTokenFilter(1)">
                                <v-icon :class="[isTokenSortActive(1) ? 'white--text' : '']">fas fa-long-arrow-alt-down</v-icon>
                            </v-btn>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-flex>

            <v-flex v-if="!isErc20" md2 />
            <v-flex md3>
                <v-layout
                    :class="[!isTokenSortActive(2) && !isTokenSortActive(3) ? 'inactive-sort' : '']"
                    grid-list-xs
                    row
                    align-center
                    justify-start
                    fill-height
                >
                    <h5 class="pl-1">{{ text }}</h5>
                    <v-flex d-flex align-center>
                        <v-layout align-start justify-right>
                            <v-btn
                                v-if="!loading && !isTokenSortActive(3)"
                                :class="[!isTokenSortActive(2) && !isTokenSortActive(3) ? 'inactive-btn' : '']"
                                flat
                                icon
                                @click="selectTokenFilter(2)"
                            >
                                <v-icon :class="[isTokenSortActive(2) ? 'white--text' : '']">fas fa-long-arrow-alt-up</v-icon>
                            </v-btn>
                            <v-btn v-if="!loading && isTokenSortActive(3)" flat icon @click="selectTokenFilter(3)">
                                <v-icon :class="[isTokenSortActive(3) ? 'white--text' : '']">fas fa-long-arrow-alt-down</v-icon>
                            </v-btn>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex v-if="isErc20" md3>
                <v-layout
                    :class="[!isTokenSortActive(4) && !isTokenSortActive(5) ? 'inactive-sort' : '']"
                    grid-list-xs
                    row
                    align-center
                    justify-start
                    fill-height
                >
                    <h5>{{ $t('usd.value') }}</h5>
                    <v-flex d-flex align-center>
                        <v-layout align-start justify-right>
                            <v-btn
                                v-if="!isTokenSortActive(5)"
                                :class="[!isTokenSortActive(4) && !isTokenSortActive(5) ? 'inactive-btn' : '']"
                                flat
                                icon
                                @click="selectTokenFilter(4)"
                            >
                                <v-icon :class="[isTokenSortActive(4) ? 'white--text' : '']">fas fa-long-arrow-alt-up</v-icon>
                            </v-btn>
                            <v-btn v-if="isTokenSortActive(5)" flat icon @click="selectTokenFilter(5)">
                                <v-icon :class="[isTokenSortActive(5) ? 'white--text' : '']">fas fa-long-arrow-alt-down</v-icon>
                            </v-btn>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex v-if="isErc20" md2>
                <v-layout
                    :class="[!isTokenSortActive(6) && !isTokenSortActive(7) ? 'inactive-sort' : '']"
                    grid-list-xs
                    row
                    align-center
                    justify-start
                    fill-height
                >
                    <h5>{{ $t('token.change') }}</h5>
                    <v-flex d-flex align-center>
                        <v-layout align-start justify-right>
                            <v-btn
                                v-if="!loading && !isTokenSortActive(7)"
                                :class="[!isTokenSortActive(6) && !isTokenSortActive(7) ? 'inactive-btn' : '']"
                                flat
                                icon
                                @click="selectTokenFilter(6)"
                            >
                                <v-icon :class="[isTokenSortActive(6) ? 'white--text' : '']">fas fa-long-arrow-alt-up</v-icon>
                            </v-btn>
                            <v-btn v-if="!loading && isTokenSortActive(7)" flat icon @click="selectTokenFilter(7)">
                                <v-icon :class="[isTokenSortActive(7) ? 'white--text' : '']">fas fa-long-arrow-alt-down</v-icon>
                            </v-btn>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { TRANSFER_FILTER_VALUES, TOKEN_FILTER_VALUES } from '@app/modules/address/models/AddressSort'

@Component
export default class TableAddressTokensHeader extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
   */
    @Prop(Boolean) isErc20!: boolean
    @Prop(Boolean) isTransfers!: boolean
    @Prop(Boolean) loading!: boolean

    tokenSort = 1
    transferSort = 1

    /*
    ===================================================================================
      Methods
    ===================================================================================
    */
    /**
     * Select token filter and emit to parent
     * @param _value {Number}
     */
    selectTokenFilter(_value: number): void {
        if (this.isTokenSortActive(_value)) {
            if (_value % 2 == 0) {
                _value = _value + 1
            } else {
                _value = _value - 1
            }
        }
        this.tokenSort = _value
        this.$emit('sortBy', TOKEN_FILTER_VALUES[this.tokenSort])
    }
    /**
     * Select transfer filter and emit to parent
     * @param _value {Number}
     */
    selectTransferFilter(_value: number): void {
        if (this.isTransferSortActive(_value)) {
            if (_value % 2 == 0) {
                _value = _value + 1
            } else {
                _value = _value - 1
            }
        }
        this.transferSort = _value
        this.$emit('sortBy', TRANSFER_FILTER_VALUES[this.transferSort])
    }
    /**
     * Check if token filter is active
     * @param _value {Number}
     * @returns {Boolean}
     */
    isTokenSortActive(_value: number): boolean {
        return this.tokenSort === _value
    }
    /**
     * Check if transfer filter is active
     * @param _value {Number}
     * @returns {Boolean}
     */
    isTransferSortActive(_value: number): boolean {
        return this.transferSort === _value
    }

    /*
    ===================================================================================
      Computed
    ===================================================================================
   */
    get text(): string {
        return this.isErc20 ? `${this.$t('common.amount')}` : `${this.$t('common.id')}`
    }
}
</script>
<style scoped lang="scss">
.token-header-container {
    height: 100%;
    .v-btn.v-btn--flat.v-btn--icon {
        height: 16px;
        width: 16px;
        margin: 0;
        .v-icon {
            font-size: 18px !important;
        }
    }
    .inactive-sort {
        .inactive-btn {
            color: transparent;
        }
        &:hover {
            .v-icon {
                color: #b4bfd2;
                display: block;
            }
        }
    }
}
</style>
