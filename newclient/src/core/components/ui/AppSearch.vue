<template>
    <v-layout align-center fill-height justify-end row height="48px" class="pl-1">
        <v-flex xs12 md8>
            <v-card flat class="search-input-container">
                <v-layout align-center justify-end>
                    <v-text-field
                        v-if="phText === 'default'"
                        v-model="searchInput"
                        :placeholder="$t('search.default')"
                        color="primary"
                        solo
                        flat
                        :prepend-inner-icon="getIcon"
                        clearable
                        spellcheck="false"
                        class="ma-0"
                        height="46px"
                        @keyup.enter="onSearch"
                        @click:clear="resetValues"
                    />
                    <v-text-field
                        v-if="phText === 'addressTxSearch'"
                        :placeholder="$t('search.address-tx')"
                        dense
                        flat
                        color="primary"
                        solo
                        clearable
                        spellcheck="false"
                        prepend-inner-icon="fa fa-search grey--text text--lighten-1 pr-4 pl-4"
                        class="ma-0"
                        height="34px"
                        @keyup.enter="onSearch"
                    />
                </v-layout>
            </v-card>
        </v-flex>
        <v-flex hidden-sm-and-down md4 class="search-button-container">
            <v-btn v-if="phText === 'default'" depressed color="secondary" class="search-button text-capitalize ml-0" @click="onSearch">{{
                $t('search.name')
            }}</v-btn>
            <v-btn v-else depressed outline class="search-button text-capitalize ml-0 primary--text lineGrey" @click="onSearch">{{ $t('search.name') }}</v-btn>
        </v-flex>
        <v-snackbar v-model="snackbar" :bottom="true" :right="true" :timeout="5000">
            SEARCH IS NOT IMPLEMENTED
            <v-btn color="primary" text @click="snackbar = false">
                Close
            </v-btn>
        </v-snackbar>
    </v-layout>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'

@Component
export default class AppSearch extends Vue {
    /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

    searchInput = ''
    phText = 'default'
    isValid = true
    snackbar = false

    /*
  ===================================================================================
    Watch
  ===================================================================================
  */

    @Watch('searchInput')
    onSearchInputChange(newVal: string, oldVal: string): void {
        if (newVal === null || newVal === '') {
            this.resetValues()
        }
    }

    /*
  ===================================================================================
    Methods
  ===================================================================================
  */
    onSearch(): void {
        this.snackbar = true
    }

    resetValues(): void {
        this.isValid = true
    }

    /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

    get getIcon(): string {
        return this.isValid ? 'fa fa-search grey--text text--lighten-1 pr-4 pl-4' : 'fa fa-search error--text pr-4 pl-4'
    }
}
</script>
<style scoped lang="css">
.search-input-container {
    height: 48px;
    border: solid 1px #efefef !important;
}
.search-button-container {
    max-width: 115px !important;
}
</style>
