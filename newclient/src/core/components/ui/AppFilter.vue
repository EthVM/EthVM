<template>
    <div :class="filterContainerClass">
        <div :class="isSort ? 'hidden-md-and-up' : 'hidden-sm-and-up'">
            <v-btn slot="activator" block outline large color="secondary" class="text-capitalize pl-2 pr-2" small @click.native.stop="dialog = true">
                <v-layout row justify-start align-center>
                    <v-flex xs2>
                        <p class="body-2 mb-0 font-weight-regular">{{ isSort ? $t('token.sort-by') : $t('filter.name') }}:</p>
                    </v-flex>
                    <v-spacer />
                    <v-flex d-flex justify-end align-center>
                        <p class="body-2 mb-0 font-weight-regular text-xs-right">
                            {{ selected.text }}
                            <i v-if="selected.filter && selected.value.includes('high')" class="fas fa-sort-amount-up" />
                            <i v-if="selected.filter && selected.value.includes('low')" class="fas fa-sort-amount-down" />
                        </p>
                    </v-flex>
                    <v-flex xs1 pr-4>
                        <v-icon class="secondary--text fas fa-chevron-right" small />
                    </v-flex>
                </v-layout>
            </v-btn>
            <v-dialog v-model="dialog" content-class="filter-dialog" full-width>
                <v-card>
                    <v-layout row class="pl-3 pr-3 pt-3">
                        <v-flex>
                            <v-card-title class="title font-weight-bold">{{ $t('filter.name') }}</v-card-title>
                        </v-flex>
                        <v-spacer />
                        <v-flex xs1 mr-3>
                            <v-btn icon @click="dialog = false">
                                <v-icon class="info--text fas fa-times" />
                            </v-btn>
                        </v-flex>
                    </v-layout>
                    <v-divider class="lineGrey"></v-divider>
                    <v-list class="pb-3">
                        <v-list-tile v-for="(option, index) in options" :key="index" class="pl-0" @click="setSelected(option)">
                            <v-layout row justify-start align-center fill-height>
                                <v-flex xs5>
                                    <v-layout row justify-start align-center>
                                        <v-card-title :class="[selected.value === option.value ? 'black--text' : 'info--text']"
                                            >{{ option.text }}{{ isSort ? ':' : '' }}</v-card-title
                                        >
                                        <v-icon v-if="!option.filter && option.value === selected.value" class="txSuccess--text fa fa-check-circle" />
                                    </v-layout>
                                </v-flex>
                                <v-flex v-if="option.filter" xs7>
                                    <v-layout row justify-start align-center>
                                        <v-card-title :class="[selected.value === option.value ? 'black--text' : 'info--text']">{{
                                            option.filter
                                        }}</v-card-title>
                                        <v-icon v-if="option.value === selected.value" class="txSuccess--text fa fa-check-circle" />
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                        </v-list-tile>
                    </v-list>
                </v-card>
            </v-dialog>
        </div>
        <!--
            =====================================================================================
              Filter dropdown (Desktop)
            =====================================================================================
            -->
        <v-layout v-if="showDesktop" :pb-2="$vuetify.breakpoint.mdAndUp" hidden-xs-only align-center px-2>
            <p class="pr-2 info--text">{{ $t('filter.name') }}</p>
            <v-card flat class="filter-select-container pl-2" height="36px">
                <v-select
                    v-model="selected"
                    :items="options"
                    return-object
                    solo
                    flat
                    hide-details
                    class="primary body-1"
                    item-text="text"
                    item-value="value"
                    height="32px"
                />
            </v-card>
        </v-layout>
    </div>
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
    @Prop(Boolean) showDesktop?: boolean
    @Prop(Boolean) isSort?: boolean
    @Prop(Object) isSelected?: object

    /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

    selected = this.options[0]
    // category = this.options[0].category
    dialog = false

    /*
  ===================================================================================
    Lifecycle
  ===================================================================================
  */

    created() {
        this.selected = this.isSelected ? this.isSelected : this.options[0]
    }

    /*
  ===================================================================================
    Computed
  ===================================================================================
  */

    get filterContainerClass(): string {
        if (
            (this.showDesktop && this.$vuetify.breakpoint.name === 'xs') ||
            (!this.showDesktop && (this.$vuetify.breakpoint.name === 'xs' || this.$vuetify.breakpoint.name === 'sm'))
        ) {
            return 'filter-container'
        }
        return ''
    }

    /*
  ===================================================================================
    Methods
  ===================================================================================
  */
    /**
     * Sets selected option and removes dialog
     * @param option {Object}
     */
    setSelected(option: object): void {
        this.selected = option
        this.dialog = false
    }

    /*
  ===================================================================================
    Watch
  ===================================================================================
  */
    @Watch('selected')
    onSelectChange(newVal: object, oldVal: object): void {
        if (newVal && newVal !== oldVal) {
            this.$emit('onSelectChange', newVal['value'])
        }
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

.filter-container {
    width: 100%;
}

.filter-dialog {
    a:hover {
        text-decoration: none !important;
    }
}
</style>
