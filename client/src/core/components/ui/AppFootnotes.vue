<template>
  <v-card flat color="transparent">
    <v-layout row pa-1>
      <div v-for="i in footnotes" :key="i.text" class="pa-1">
        <v-layout row align-center justify-start>
          <v-icon :class="classIcon" :color="getColor(i)">{{ i.icon }}</v-icon>
          <v-card-text :class="classText">{{ i.text }}</v-card-text>
        </v-layout>
      </div>
    </v-layout>
  </v-card>
</template>

<script lang="ts">
import { Footnote } from '@app/core/components/props'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class AppFootnotes extends Vue {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop(Array) footnotes!: Footnote[]

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  getColor(note: Footnote): string {
    return note.color
  }

  get classText(): string {
    return this.isMobile ? 'footnote-mobile-text pl-1' : 'pl-1 caption'
  }
  get classIcon(): string {
    return this.isMobile ? 'footnote-mobile-icon' : 'footnote-desktop-icon'
  }

  get isMobile(): boolean {
    return this.$vuetify.breakpoint.name === 'xs'
  }
}
</script>

<style scoped lang="css">
.footnote-mobile-text {
  font-size: 9px;
}
.footnote-mobile-icon {
  font-size: 10px;
}
.footnote-desktop-icon {
  font-size: 12px
}
</style>
