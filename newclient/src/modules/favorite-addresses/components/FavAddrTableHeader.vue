<template>
    <!--
    =====================================================================================
      TABLE HEADER
    =====================================================================================
    -->
    <v-layout grid-list-xs align-center justify-start row fill-height pr-2 pl-2>
        <v-flex v-if="deleteMode" md1>
            <v-layout row align-center justify-start pl-2>
                <app-check-box :values-array="deleteArray" :is-select-all="true" :is-white="true" :all-selected="allSelected" @selectAll="selectAll" />
                <p class="select-all">{{ $t('fav.select-all') }}</p>
            </v-layout>
        </v-flex>
        <v-flex md4>
            <v-layout :class="[!isActive(0) && !isActive(1) ? 'inactive-sort' : '', 'pl-1']" align-center justify-start row>
                <h5 class="pl-4 ml-4">{{ $tc('address.name', 1) }}</h5>
                <v-flex d-flex align-center>
                    <v-layout align-start justify-right pl-1>
                        <v-btn v-if="!loading && !isActive(1)" :class="[!isActive(0) && !isActive(1) ? 'inactive-btn' : '']" flat icon @click="selectFilter(0)">
                            <v-icon :class="[isActive(0) ? 'white--text' : '']" small>fas fa-sort-amount-down</v-icon>
                        </v-btn>
                        <v-btn v-if="!loading && isActive(1)" flat icon @click="selectFilter(1)">
                            <v-icon :class="[isActive(1) ? 'white--text' : '']" small>fas fa-sort-amount-up</v-icon>
                        </v-btn>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-flex>
        <v-flex md3 pl-3>
            <v-layout :class="[!isActive(2) && !isActive(3) ? 'inactive-sort' : '', 'pl-4']" align-center justify-start row>
                <h5 class="pl-3">{{ $t('fav.name') }}</h5>
                <v-flex d-flex align-center>
                    <v-layout align-start justify-right>
                        <v-btn v-if="!loading && !isActive(3)" :class="[!isActive(2) && !isActive(3) ? 'inactive-btn' : '']" flat icon @click="selectFilter(2)">
                            <v-icon :class="['ml-2', isActive(2) ? 'white--text' : '']" small>fas fa-sort-amount-down</v-icon>
                        </v-btn>
                        <v-btn v-if="!loading && isActive(3)" flat icon @click="selectFilter(3)">
                            <v-icon :class="['ml-2', isActive(3) ? 'white--text' : '']" small>fas fa-sort-amount-up</v-icon>
                        </v-btn>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-flex>
        <v-flex md2 pl-3>
            <h5>{{ $t('common.eth-balance') }}</h5>
            <!-- <v-layout :class="[!isActive(4) && !isActive(5) ? 'inactive-sort' : '']" align-center justify-start row>
                <v-flex d-flex align-center>
                    <v-layout align-start justify-right>
                        <v-btn v-if="!loading && !isActive(5)" :class="[!isActive(4) && !isActive(5) ? 'inactive-btn' : '']" flat icon @click="selectFilter(5)">
                            <v-icon :class="[isActive(4) ? 'white--text' : '']" small>fas fa-sort-amount-up</v-icon>
                        </v-btn>
                        <v-btn v-if="!loading && isActive(5)" flat icon @click="selectFilter(4)">
                            <v-icon :class="[isActive(5) ? 'white--text' : '']" small>fas fa-sort-amount-down</v-icon>
                        </v-btn>
                    </v-layout>
                </v-flex>
            </v-layout> -->
        </v-flex>
        <v-flex md2 pl-0>
            <h5 class="pl-5">{{ $t('usd.value') }}</h5>
            <!-- <v-layout :class="[!isActive(6) && !isActive(7) ? 'inactive-sort' : '']" align-center justify-start row>
                <v-flex d-flex align-center>
                    <v-layout align-start justify-right>
                        <v-btn v-if="!loading && !isActive(7)" :class="[!isActive(6) && !isActive(7) ? 'inactive-btn' : '']" flat icon @click="selectFilter(7)">
                            <v-icon :class="[isActive(6) ? 'white--text' : '']" small>fas fa-sort-amount-up</v-icon>
                        </v-btn>
                        <v-btn v-if="!loading && isActive(7)" flat icon @click="selectFilter(6)">
                            <v-icon :class="[isActive(7) ? 'white--text' : '']" small>fas fa-sort-amount-down</v-icon>
                        </v-btn>
                    </v-layout>
                </v-flex>
            </v-layout> -->
        </v-flex>
        <v-spacer v-if="deleteMode" />
    </v-layout>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import AppCheckBox from '@app/core/components/ui/AppCheckBox.vue'
import { FILTER_VALUES } from '@app/modules/favorite-addresses/models/FavSort'

@Component({
    components: {
        AppCheckBox
    }
})
export default class TableAddressTxsHeader extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */
    @Prop({ type: Boolean, default: false }) allSelected!: boolean
    @Prop(Array) deleteArray!: string[]
    @Prop(Boolean) deleteMode!: boolean
    @Prop(Boolean) loading!: boolean

    /*
    ===================================================================================
      Data
    ===================================================================================
    */
    sort = -1
    /*
    ===================================================================================
      Methods
    ===================================================================================
    */
    selectAll(): void {
        this.$emit('selectAllInHeader')
    }
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
}
</script>
<style scoped lang="scss">
.select-all {
    font-size: 80%;
    white-space: nowrap;
}
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
</style>
