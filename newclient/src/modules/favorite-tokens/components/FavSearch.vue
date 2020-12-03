<template>
    <v-layout class="fav-search">
        <v-flex xs12 sm12 md9 px-2 d-flex align-center justify-center>
            <v-text-field
                v-model="searchVal"
                :loading="isLoading"
                :placeholder="$t('search.favorites-token')"
                prepend-inner-icon="fa fa-search grey--text text--lighten-1"
                color="primary"
                solo
                flat
                outline
                clearable
                return-masked-value
                @keyup.enter="onSearch"
                @input="onSearch"
                @click:clear="searchVal = ''"
            ></v-text-field>
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
        height: 42px;
        .v-input__slot {
            border: 1px solid #b4bfd2 !important;
            min-height: 42px !important;
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
}
</style>
