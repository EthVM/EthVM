<template>
  <div>
    <!-- <div v-for="(token, index) in tokens" :key="index">{{token}}</div> -->
  </div>
</template>

<script lang="ts">
import AppErrorNoData from '@app/core/components/ui/AppErrorNoData.vue'
import AppInfoLoad from '@app/core/components/ui/AppInfoLoad.vue'
import BN from 'bignumber.js'
import { Vue, Component, Prop, Mixins } from 'vue-property-decorator'

@Component({
  components: {
    AppErrorNoData,
    AppInfoLoad
  }
})
export default class TableTokens extends Vue {
  // @Prop(Array) tokens!: Array<any>
}
</script>
