<template>
  <div>
    <v-layout row align-center justify-end>
      <v-icon class="fas fa-globe" small />
      <v-select v-model="language" :items="items" item-text="name" item-value="_id" @change="changeLocale" solo flat class="lang-select" />
    </v-layout>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import storePack from 'store'

@Component
export default class AppLanguage extends Vue {
  /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

  items = [{ _id: 'en_US', name: 'English' }, { _id: 'ru_RU', name: 'Russian' }]
  language = 'en_US'

  /*
  ===================================================================================
    Lifecycle
  ===================================================================================
  */

  created() {
    if (storePack.get('language') && this.isLang(storePack.get('language'))) {
      this.$i18n.locale = storePack.get('language')
      this.language = storePack.get('language')
    }
  }
  /*
  ===================================================================================
    Computed
  ===================================================================================
  */

  get appLang() {
    return storePack.get('language')
  }

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  changeLocale(): void {
    this.$i18n.locale = this.language
    storePack.set('language', this.language)
    window.scrollTo(0, 0)
  }

  isLang(lang: string): boolean {
    this.items.forEach(i => {
      if (i._id === lang) {
        return true
      }
    })
    return false
  }
}
</script>

<style scoped lang="css">
.lang-select {
  max-width: 120px;
  height: 32px;
}
</style>
