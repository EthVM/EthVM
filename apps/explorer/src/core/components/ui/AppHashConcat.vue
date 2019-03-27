<template>
  <div class="hash-container">
    <v-layout row :class="hashClass" justify-start fill-height>
      <p>{{first}}</p>
      <p class="concat">{{middle}}</p>
      <p>{{last}}</p>
    </v-layout>
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

  @Prop(Boolean) hash!: string
  @Prop(Boolean) italic: boolean = false

  /*
  ===================================================================================
    Computed
  ===================================================================================
  */


  get last():string {
    let n = this.hash.length
    return this.hash.slice(n-4,n)
  }
  get first(): string {
    return this.hash.slice(0,6)
  }
  get middle():string {
    let n = this.hash.length
    return this.hash.slice(6, n-4)
  }

  get hashClass(): string {
    return this.italic? 'font-italic secondary--text' : 'secondary--text'
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
