<template>
    <v-snackbar v-model="show" :bottom="true" :timeout="0" :auto-height="true" class="app-message" color="sync">
        <v-layout class="px-3 py-3" row wrap align-center justify-center>
            <v-flex shrink pl-2 pr-2>
                <v-img :src="require('@/assets/icon-warning.png')" width="30px" height="30px" contain />
            </v-flex>
            <v-flex :class="[$vuetify.breakpoint.xsOnly ? 'text-xs-center py-3' : '']" grow>
                <p v-for="(message, i) in messages" :key="i" class="black--text font-italic">{{ message }}</p>
            </v-flex>
            <v-flex shrink>
                <v-btn outline color="primary" class="text-capitalize px-4 py-2 ml-0" @click="show = false">Got It</v-btn>
            </v-flex>
        </v-layout>
    </v-snackbar>
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

    @Prop(Boolean) syncing?: boolean
    @Prop(Boolean) connected?: boolean

    /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

    hide: boolean = false
    show: boolean = false
    messages: TranslateResult[] = new Array()
    debouncedShow = debounce(this.setShow, 1000)
    debouncedMess = debounce(this.setMessage, 1000)

    /*
  ===================================================================================
    LifeCycle
  ===================================================================================
  */

    created() {
        if (this.syncing || this.connected) {
            this.debouncedShow()
            this.debouncedMess()
        }
    }

    /*
  ===================================================================================
    Watch
  ===================================================================================
  */

    @Watch('syncing')
    onSyncingChanged(): void {
        this.debouncedShow()
        this.debouncedMess()
    }

    @Watch('connected')
    onConnectedChanged(): void {
        this.debouncedShow()
        this.debouncedMess()
    }

    /*
  ===================================================================================
    Methods
  ===================================================================================
  */

    setShow(): void {
        this.show = this.syncing || this.connected || false
    }

    setMessage(): void {
        this.messages = []
        if (this.syncing) {
            this.messages.push(this.$t('message.sync.main'))
        }
        if (this.connected) {
            this.messages.push(this.$t('message.disconnected'))
        }
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
