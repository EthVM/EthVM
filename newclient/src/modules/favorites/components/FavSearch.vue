<template>
    <v-layout class="fav-search">
        <v-flex xs12 sm12 md9 pr-0 d-flex align-center justify-center>
            <v-text-field
                :loading="isLoading"
                :placeholder="$t('search.favorites')"
                v-model="searchVal"
                prepend-inner-icon="fa fa-search info--text"
                color="lineGrey"
                solo
                flat
                outline
                clearable
                height="34px"
                return-masked-value
                @keyup.enter="onSearch"
                @input="onSearch"
                @click:clear="searchVal = ''"
            ></v-text-field>
            <v-btn right flat small depressed color="secondary" class="search-button text-capitalize ma-0 pr-0 pl-0" @click="onSearch">{{
                $t('search.name')
            }}</v-btn>
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component
export default class FavSearch extends Vue {
    /*
  ===================================================================================
    Props
  ===================================================================================
  */
    @Prop({ type: Array }) items!: any[]
    @Prop({ type: Boolean }) isLoading!: string

    /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */
    searchVal = ''

    /*
  ===================================================================================
    Methods
  ===================================================================================
  */
    onSearch(): void {
        this.$emit('search', this.searchVal)
    }
}
</script>

<style lang="scss">
.fav-search {
    .v-input {
        font-size: 14px;
        height: 40px;
        .v-input__slot {
            border: 1px solid #b4bfd2 !important;
            border-right: none !important;
            min-height: 40px !important;
            padding-left: 4px !important;
            padding-right: 4px !important;
            font-size: 90%;
            input {
                margin-top: 0;
            }
            .v-icon {
                font-size: 16px;
            }
        }
    }
    .search-button {
        border: 1px solid #b4bfd2 !important;
        border-left: none !important;
        height: 40px;
        max-width: 60px !important;
    }
}
</style>
