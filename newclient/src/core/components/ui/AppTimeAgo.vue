<template>
    <p class="black--text mb-0 caption">
        {{ timeSince(timestamp) }}
    </p>
</template>

<script lang="ts">
import { Vue, Component, Prop, Mixins } from 'vue-property-decorator'
import VueTimeago from 'vue-timeago'
import VueTimeTicker from 'vue-time-ticker'
import { TranslateResult } from 'vue-i18n'
import { NumberFormatMixin } from '@app/core/components/mixins/number-format.mixin'

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
export default class AppTimeAgo extends Mixins(Vue, NumberFormatMixin) {
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
}
</script>
