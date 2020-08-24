<template>
    <p class="black--text mb-0 caption">
        <timeago :datetime="timestamp" :locale="locale" :auto-update="60" />
        <!-- <vue-time-ticker v-else :value="timestamp.toString()" format="SECONDS" />
        {{ text }} -->
    </p>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import VueTimeago from 'vue-timeago'
import VueTimeTicker from 'vue-time-ticker'
import { TranslateResult } from 'vue-i18n'

Vue.use(VueTimeago, {
    name: 'timeago',
    locale: 'en-US',
    locales: {
        'en-US': require('date-fns/locale/en'),
        ru: require('date-fns/locale/ru')
    }
})

@Component({
    components: {
        VueTimeTicker
    }
})
export default class AppTimeAgo extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */

    @Prop(Date) timestamp!: Date

    /*
    ===================================================================================
     Initial Data
    ===================================================================================
    */

    // currentTime = Date.now()
    // count?: NodeJS.Timeout
    /*
    ===================================================================================
      Computed
    ===================================================================================
    */
    get locale(): string {
        const currLang = this.$i18n.locale
        switch (currLang) {
            case 'en_US':
                return 'en'
            case 'ru_RU':
                return 'ru'
            default:
                return 'en'
        }
    }
    // get moreThenAMin(): boolean {
    //     return new Date().getTime() - this.timestamp.getTime() >= 60 * 1e3
    // }
    // get text(): TranslateResult {
    //     return !this.moreThenAMin ? this.$t('message.sec-ago') : ''
    // }
    /*
    ===================================================================================
      Lifecycle
    ===================================================================================
    */
    // mounted() {
    //     this.currentTime = Date.now()
    //     if (!this.moreThenAMin) {
    //         this.count = setInterval(() => {
    //             this.currentTime = Date.now()
    //             if (this.moreThenAMin && this.count) {
    //                 clearInterval(this.count)
    //             }
    //         }, 1000)
    //     }
    // }
    // beforeDestroy() {
    //     if (this.count) {
    //         clearInterval(this.count)
    //     }
    // }
}
</script>
