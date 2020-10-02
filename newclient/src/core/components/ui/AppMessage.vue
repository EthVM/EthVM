<template>
    <div>
        <v-snackbar v-model="showLarge" :bottom="true" :timeout="0" :auto-height="true" class="app-message" color="sync">
            <v-layout class="pa-1" row wrap align-center justify-center>
                <v-flex shrink pl-2 pr-2>
                    <v-img :src="require('@/assets/icon-warning.png')" width="30px" height="30px" contain />
                </v-flex>
                <v-flex :class="[$vuetify.breakpoint.xsOnly ? 'text-xs-center py-3' : '']" grow>
                    <p v-for="(message, i) in messages" :key="i" class="black--text font-italic">{{ $t(message) }}</p>
                </v-flex>
                <v-flex shrink>
                    <v-btn outline color="primary" class="text-capitalize px-4 py-2 ml-0" @click="debouncedSetSmall()">Got It</v-btn>
                </v-flex>
            </v-layout>
        </v-snackbar>
        <v-fab-transition>
            <v-btn v-show="isSmall && showErrors" color="transparent" fab icon fixed bottom right @click="debouncedSetLarge()">
                <v-img :src="require('@/assets/icon-warning-outline.png')" height="56px" max-width="56px" contain class="mb-2 mt-2"></v-img>
            </v-btn>
        </v-fab-transition>
    </div>
</template>

<script lang="ts">
/*
  ===================================================================================
   Computed
  ===================================================================================
  */
import { Vue, Component, Watch, Prop } from 'vue-property-decorator'
import debounce from 'lodash.debounce'
import { TranslateResult } from 'vue-i18n'
import { connect } from 'http2'
import { setTimeout } from 'timers'
@Component
export default class AppMessage extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */

    @Prop(Array) messages!: string[]

    /*
    ===================================================================================
      Initial Data
    ===================================================================================
    */

    isLarge: boolean = false
    isSmall: boolean = false
    debouncedSmall = debounce(this.setIsSmall, 400)
    debouncedLarge = debounce(this.setIsLarge, 400)

    /*
    ===================================================================================
      Watch
    ===================================================================================
    */

    @Watch('showErrors')
    onShowErrorsChanged(newVal: boolean, oldVal: boolean): void {
        if (newVal && newVal != oldVal) {
            this.debouncedSetSmall()
        }
        if (!newVal && newVal != oldVal) {
            this.hideAll()
        }
    }

    /*
    ===================================================================================
      Computed
    ===================================================================================
    */

    get showErrors(): boolean {
        return this.messages && this.messages.length > 0
    }
    get showLarge(): boolean {
        return this.isLarge && this.showErrors
    }

    /*
    ===================================================================================
      Methods
    ===================================================================================
    */
    /**
     * Sets isLarge as false and calls
     * debouncedSmall
     */
    debouncedSetSmall(): void {
        this.isLarge = false
        this.debouncedSmall()
    }
    /**
     * Sets isSmall as false and calls
     * debouncedLarge
     */
    debouncedSetLarge(): void {
        this.isSmall = false
        this.debouncedLarge()
    }
    /**
     * Sets isSmall as true
     */
    setIsSmall(): void {
        this.isSmall = true
    }
    /**
     * Sets isLarge as true
     */
    setIsLarge(): void {
        this.isLarge = true
    }
    /**
     * Sets isLarge as false
     * Sets isSmall as false
     */
    hideAll(): void {
        this.isLarge = false
        this.isSmall = false
    }
}
</script>

<style lang="scss">
.app-message {
    .v-snack__wrapper {
        min-width: 100%;
    }
}
</style>
