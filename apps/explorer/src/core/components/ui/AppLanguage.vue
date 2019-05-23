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
  loaded = ['en_US']

  /*
  ===================================================================================
    Lifecycle
  ===================================================================================
  */

  mounted() {
    if (this.appLang && this.isLang(this.appLang)) {
      this.language = this.appLang
      this.changeLocale()
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

  async changeLocale(): Promise<void> {
    if (this.$i18n.locale === this.language) {
      return
    }

    if (this.loaded.includes(this.language)) {
      this.setLang()
      return
    }

    let messages

    try {
      messages = await import(/* webpackChunkName: "lang-[request]" */ `@app/translations/${this.language}.json`)
    } catch (e) {
      throw e
    }

    if (!messages) {
      throw new Error(`No messages found for language ${this.language}`)
    }

    this.$i18n.setLocaleMessage(this.language, messages.default)
    this.loaded.push(this.language)
    this.setLang()

  }

  setLang(): void {
    this.$i18n.locale = this.language
    storePack.set('language', this.language)
    window.scrollTo(0, 0)
  }

  isLang(lang: string): boolean {
    return this.items.find(l => l._id === lang) !== undefined
  }
}
</script>

<style scoped lang="css">
.lang-select {
  max-width: 120px;
  height: 32px;
}
</style>
