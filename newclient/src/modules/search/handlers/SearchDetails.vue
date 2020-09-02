<template>
    <search
        ref="search"
        :items="items"
        :is-loading="isLoading"
        :select-items="selectItems"
        :has-error="hasError"
        @onSelect="onSelect"
        @getToken="getToken"
        @getAllSearch="getAllSearch"
        @routeTo="routeTo"
    />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getTokensBeginsWith, getHashType } from '@app/modules/search/handlers/searchDetails.graphql'
import Search from '@app/modules/search/components/Search.vue'

interface SearchRef extends Vue {
    resetValues(): void
}

@Component({
    components: {
        Search
    }
})
export default class SearchDetails extends Vue {
    $refs!: {
        search: SearchRef
    }
    /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */
    hasError = false
    searchAutocomplete = ''
    items = []
    isLoading = false

    /*
  ===================================================================================
    Methods
  ===================================================================================
  */

    getHashType(param): void {
        let routeName = ''
        this.isLoading = true
        this.hasError = false
        this.$apollo
            .query({
                query: getHashType,
                variables: {
                    hash: this.removeSpaces(param)
                }
            })
            .then(response => {
                const hashType = response.data.getHashType
                if (hashType.includes('ADDRESS')) {
                    routeName = 'address'
                } else if (hashType.includes('TX')) {
                    routeName = 'transaction'
                } else if (hashType.includes('TOKEN')) {
                    routeName = 'token-detail'
                } else if (hashType.includes('UNCLE')) {
                    routeName = 'uncle'
                } else if (hashType.includes('BLOCK')) {
                    routeName = 'blockHash'
                } else {
                    this.hasError = true
                }
                this.routeTo(routeName, param)
                this.isLoading = false
            })
            .catch(error => {
                this.hasError = true
                this.isLoading = false
                throw error
            })
    }

    routeTo(selectVal, searchVal): void {
        const route = { name: selectVal, params: this.getParam(selectVal, searchVal) }
        this.$router.push(route).catch(() => {})
    }

    routeToToken(param): void {
        const route = { name: 'token-detail', params: { addressRef: this.removeSpaces(param) } }
        this.$router.push(route).catch(() => {})
    }

    getParam(selectVal, searchVal): {} {
        if (selectVal === 'transaction') {
            return { txRef: this.removeSpaces(searchVal) }
        } else if (selectVal === 'token-detail' || selectVal === 'address') {
            return { addressRef: this.removeSpaces(searchVal) }
        } else if (selectVal === 'uncle') {
            return { uncleRef: this.removeSpaces(searchVal) }
        }
        return { blockRef: this.removeSpaces(searchVal) }
    }

    getToken(param): void {
        if (!this.onlyLetters(param)) {
            return
        }
        this.isLoading = true
        this.hasError = false
        this.$apollo
            .query({
                query: getTokensBeginsWith,
                variables: {
                    keyword: param.trim()
                }
            })
            .then(response => {
                this.items = response.data.getTokensBeginsWith
                if (this.items.length === 1 && this.items[0]['contract'] && this.items[0]['keyword'] === param.trim().toLowerCase()) {
                    this.routeToToken(this.items[0]['contract'])
                }
                if (this.items.length === 0) {
                    this.hasError = true
                }
                this.isLoading = false
                this.$refs.search.resetValues()
            })
            .catch(error => {
                this.hasError = true
                this.isLoading = false
                throw error
            })
    }

    getAllSearch(param): void {
        if (param && param.contract) {
            this.routeToToken(param.contract)
        }
        this.onlyLetters(param) ? this.getToken(param) : this.getHashType(param)
    }

    onSelect(param): void {
        if (param && param.contract) {
            this.routeToToken(param.contract)
        }
    }

    removeSpaces(val): string {
        if (val) {
            return val.replace(/ /g, '')
        }
        return ''
    }

    onlyLetters(param): boolean {
        const value = this.removeSpaces(param)
        return /^[a-zA-Z]+$/.test(value) ? true : false
    }

    /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

    get selectItems(): any[] {
        return [
            { text: this.$t('filter.all'), value: 'all' },
            { text: this.$t('kb.terms.block.term'), value: 'block' },
            { text: this.$tc('tx.name-short', 1), value: 'transaction' },
            { text: this.$tc('address.name', 1), value: 'address' },
            { text: this.$tc('token.name', 1), value: 'token-detail' },
            { text: this.$tc('uncle.name', 1), value: 'uncle' }
        ]
    }
}
</script>
