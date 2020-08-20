<template>
    <v-layout align-center px-2>
        <p class="pr-2 info--text">{{ $t('filter.name') }}</p>
        <v-card flat class="filter-select-container pl-2" height="36px">
            <v-select v-model="filter" :items="options" solo flat hide-details class="primary body-1" item-text="text" item-value="value" height="32px" />
        </v-card>
    </v-layout>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

@Component
export default class AppFilter extends Vue {
    /*
  ===================================================================================
    Props
  ===================================================================================
  */
    @Prop(Array) options!: any[]

    /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

    filter = null

    /*
  ===================================================================================
    Watch
  ===================================================================================
  */
    @Watch('filter')
    onFilterChange(newVal: string, oldVal: string) {
        if (newVal && newVal !== oldVal) {
            this.$emit('onFilterChange', newVal)
        }
        console.error('newval', newVal)
    }
}
</script>

<style lang="scss">
.filter-select-container {
    border: solid 1px #efefef !important;
    padding-top: 1px;
    .v-select.v-text-field {
        input {
            width: 0;
        }
    }
}
</style>
