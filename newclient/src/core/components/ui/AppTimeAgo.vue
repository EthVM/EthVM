<template>
    <p class="black--text mb-0">
        <timeago v-if="moreThenAMin" :datetime="timestamp" :locale="locale" :auto-update="60" />
        <vue-time-ticker v-else :value="timestamp.toString()" format="SECONDS" />
        {{ text }}
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

    currentTime = Date.now()
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
    get moreThenAMin(): boolean {
        const diffInMilliSeconds = Math.abs(this.currentTime - this.timestamp.getTime()) / 1000
        const minutes = Math.floor(diffInMilliSeconds / 60) % 60
        return minutes > 0
    }
    get text(): TranslateResult {
        return !this.moreThenAMin ? this.$t('message.sec-ago') : ''
    }
    /*
    ===================================================================================
      Lifecycle
    ===================================================================================
    */
    mounted() {
        this.currentTime = Date.now()
        if (!this.moreThenAMin) {
            const count = setInterval(() => {
                this.currentTime = Date.now()
                if (this.moreThenAMin) {
                    clearInterval(count)
                }
            }, 500)
        }
    }
}
</script>
