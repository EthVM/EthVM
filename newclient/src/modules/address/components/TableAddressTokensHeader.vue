<template>
    <div class="token-header-container">
        <!--
        =====================================================================================
          TRANSFERS HEADER
        =====================================================================================
        -->
        <v-layout v-if="isTransfers" align-center justify-start row fill-height>
            <v-flex md3>
                <h5 class="pl-3">{{ this.$tc('token.name', 1) }}</h5>
            </v-flex>
            <v-spacer />
            <v-flex md3>
                <h5>{{ text }}</h5>
            </v-flex>
            <v-flex md2>
                <h5>{{ $t('common.age') }}</h5>
            </v-flex>
        </v-layout>
        <!--
        =====================================================================================
          TOKENS HEADER
        =====================================================================================
        -->
        <v-layout v-else align-center justify-start row fill-height>
            <v-flex md4>
                <v-layout :class="[!isActive(0) && !isActive(1) ? 'inactive-sort' : '']" grid-list-xs row align-center justify-start fill-height>
                    <div class="token-image" />
                    <h5>{{ $t('token.tokenName') }}</h5>
                    <v-flex d-flex align-center>
                        <v-layout align-start justify-right>
                            <v-btn v-if="!isActive(1)" :class="[!isActive(0) && !isActive(1) ? 'inactive-btn' : '']" flat icon @click="selectFilter(0)">
                                <v-icon :class="[isActive(0) ? 'white--text' : '']">fas fa-long-arrow-alt-up</v-icon>
                            </v-btn>
                            <v-btn v-if="isActive(1)" flat icon @click="selectFilter(1)">
                                <v-icon :class="[isActive(1) ? 'white--text' : '']">fas fa-long-arrow-alt-down</v-icon>
                            </v-btn>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-flex>

            <v-flex v-if="!isErc20" md2 />
            <v-flex md3>
                <v-layout :class="[!isActive(2) && !isActive(3) ? 'inactive-sort' : '']" grid-list-xs row align-center justify-start fill-height>
                    <h5 class="pl-1">{{ text }}</h5>
                    <v-flex d-flex align-center>
                        <v-layout align-start justify-right>
                            <v-btn v-if="!isActive(3)" :class="[!isActive(2) && !isActive(3) ? 'inactive-btn' : '']" flat icon @click="selectFilter(2)">
                                <v-icon :class="[isActive(2) ? 'white--text' : '']">fas fa-long-arrow-alt-up</v-icon>
                            </v-btn>
                            <v-btn v-if="isActive(3)" flat icon @click="selectFilter(3)">
                                <v-icon :class="[isActive(3) ? 'white--text' : '']">fas fa-long-arrow-alt-down</v-icon>
                            </v-btn>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex v-if="isErc20" md3>
                <v-layout :class="[!isActive(4) && !isActive(5) ? 'inactive-sort' : '']" grid-list-xs row align-center justify-start fill-height>
                    <h5>{{ $t('usd.value') }}</h5>
                    <v-flex d-flex align-center>
                        <v-layout align-start justify-right>
                            <v-btn v-if="!isActive(5)" :class="[!isActive(4) && !isActive(5) ? 'inactive-btn' : '']" flat icon @click="selectFilter(4)">
                                <v-icon :class="[isActive(4) ? 'white--text' : '']">fas fa-long-arrow-alt-up</v-icon>
                            </v-btn>
                            <v-btn v-if="isActive(5)" flat icon @click="selectFilter(5)">
                                <v-icon :class="[isActive(5) ? 'white--text' : '']">fas fa-long-arrow-alt-down</v-icon>
                            </v-btn>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex v-if="isErc20" md2>
                <v-layout :class="[!isActive(6) && !isActive(7) ? 'inactive-sort' : '']" grid-list-xs row align-center justify-start fill-height>
                    <h5>{{ $t('token.change') }}</h5>
                    <v-flex d-flex align-center>
                        <v-layout align-start justify-right>
                            <v-btn v-if="!isActive(7)" :class="[!isActive(6) && !isActive(7) ? 'inactive-btn' : '']" flat icon @click="selectFilter(6)">
                                <v-icon :class="[isActive(6) ? 'white--text' : '']">fas fa-long-arrow-alt-up</v-icon>
                            </v-btn>
                            <v-btn v-if="isActive(7)" flat icon @click="selectFilter(7)">
                                <v-icon :class="[isActive(7) ? 'white--text' : '']">fas fa-long-arrow-alt-down</v-icon>
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
const FILTER_VALUES = ['name_high', 'name_low', 'amount_high', 'amount_low', 'value_high', 'value_low', 'change_high', 'change_low']

@Component
export default class TableAddressTokensHeader extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
   */
    @Prop(Boolean) isErc20!: boolean
    @Prop(Boolean) isTransfers!: boolean

    sort = -1
    /*
    ===================================================================================
      Methods
    ===================================================================================
    */
    /**
     * Select filter and emit to parent
     * @param _value {Number}
     */
    selectFilter(_value: number): void {
        if (this.isActive(_value)) {
            if (_value % 2 == 0) {
                _value = _value + 1
            } else {
                _value = _value - 1
            }
        }
        this.sort = _value
        this.$emit('sortBy', FILTER_VALUES[this.sort])
    }
    /**
     * Check if filter is active
     * @param _value {Number}
     * @returns {Boolean}
     */
    isActive(_value: number): boolean {
        return this.sort === _value
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
