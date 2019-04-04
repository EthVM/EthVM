<template>
  <div :class="hashClass" @click="reroute">
    <p>{{ first }}</p>
    <p class="concat">{{ middle }}</p>
    <p>{{ last }}</p>
  </div>
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
  @Prop({ type: Boolean, default: true}) isBlue!: boolean

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
    if (!this.isBlue) {
      return this.italic ? 'hash-container font-italic black--text font-mono' : ' hash-container black--text font-mono'
    }
    return this.italic ? 'hash-container font-italic secondary--text font-mono' : ' hash-container secondary--text font-mono'
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
  display: flex;
  flex-shrink: 2;
}

.concat{
  overflow: hidden;
  text-overflow: ellipsis;

}
p{
  margin-bottom: 0px;
}

</style>
