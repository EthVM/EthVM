<template>
  <v-container class="hash-container pa-2" @click="reroute">
    <v-layout block row :class="hashClass" align-center justify-start fill-height>
      <p>{{ first }}</p>
      <p class="concat">{{ middle }}</p>
      <p>{{ last }}</p>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class AppHashConcat extends Vue {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop(String) hash!: string
  @Prop({ type: Boolean, default: false }) italic!: boolean
  @Prop(String) link!: string

  /*
  ===================================================================================
    Computed
  ===================================================================================
  */

  get last(): string {
    const n = this.hash.length
    return this.hash.slice(n - 4, n)
  }
  get first(): string {
    return this.hash.slice(0, 4)
  }
  get middle(): string {
    const n = this.hash.length
    return this.hash.slice(4, n - 4)
  }

  get hashClass(): string {
    return this.italic ? 'font-italic secondary--text' : 'secondary--text'
  }

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  reroute(): void {
    if (this.link) {
      this.$router.push({ path: this.link })
    }
  }
}
</script>

<style scoped lang="css">

.hash-container {
  min-width: 80px;
}
.concat{
  overflow: hidden;
  text-overflow: ellipsis;

}
p{
  margin-bottom: 0px;
}
</style>
