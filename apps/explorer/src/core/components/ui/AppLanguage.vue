<template>
  <v-select
    v-model="language"
    :items="items"
    item-text="name"
    return-object
     @change="changeLocale"
  />
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { TranslateResult } from 'vue-i18n'

@Component
export default class AppLanguage extends Vue {

  /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

  items = [
    { _id: 'en_US',
      name: "English"
    },
    { _id: 'ru_RU',
      name: "Russian"
    },
    { _id: 'es_ES',
      name: "Espanol"
  }]

  language = this.items[0]


  /*
  ===================================================================================
    Lifecycle
  ===================================================================================
  */

  created() {
    //Get Local Storage Langauge
    //Set Language
    //this.language = local storage
    //his.$i18n.locale = language
  }



  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  changeLocale(): void {
    //this.$i18n.locale =  this.language._id
    //NOTE: commit to local store selected language
    //Scroll to top?
  }




}
</script>

<style scoped lang="css">

</style>
