<template>
  <p class="black--text text-truncate mb-0"><timeago :datetime="timestamp"  :locale="locale" :auto-update="60"></timeago></p>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class AppTimeAgo extends Vue {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop(Date) timestamp!: Date

  /*
  ===================================================================================
    Computed
  ===================================================================================
  */
  get locale(): string {
    const  currLang = this.$i18n.locale
     switch (currLang ) {
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
