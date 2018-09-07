<template>
  <div class="pr-0">
    <v-text-field v-if="phText === 'default'" color="white" dark flat hide-details autofocus v-bind:label="$t('search.default')" append-icon="fa fa-search white--text" class="pb-2 mt-1"></v-text-field>
    <v-text-field v-if="phText === 'addressTxSearch'"  flat hide-details v-bind:label="$t('search.addressTx')" append-icon="fa fa-search white--text"></v-text-field>
    <div v-if="search === true" class="search-result">
      <p><a href="">5121656486846536321513151684613513512165648684653632151315168461351351216564868465363215131516846135135121656486846536321513151</a></p>
      <p><a href="">6846135135121656486846536321513151684613513512165648684653632151315168461351351216564868465363215131516846135135121656486846536321513151</a></p>
      <p><a href="">6846135135121656486846536321513151684613513512165648684653632151315168461351351216564868465363215131516846135135121656486846536321513151</a></p>
      <p><a href="">165648684653632151315168461351351216564868465363215131516846135135121656486846536321513151</a></p>
      <p><a href="">6846135135121656486846536321513151684613513512165648684653632151315168461351351216564868465363215131516846135135121656486846536321513151</a></p>
      <p><a href="">36321513151684613513512165648684653632151315168461351351216564868465363215131516846135135121656486846536321513151</a></p>
      <p><a href="">6846135135121656486846536321513151684613513512165648684653632151315168461351351216564868465363215131516846135135121656486846536321513151</a></p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Search',
  props: {
    phText: {
      type: String,
      default: 'default'
    }
  },
  data() {
    return {
      search: String
    }
  },
  methods: {
    setSearch() {
      return (this.search = !this.search)
    }
  },
  computed: {
    default(): string {
      return this.$i18n.t('search.default')
    }
  }
})
</script>
