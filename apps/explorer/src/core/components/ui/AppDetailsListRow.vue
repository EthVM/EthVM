<template>
  <div>
    <v-layout align-start justify-start row class="pa-2 mr-2 ml-2">
      <!--
      =====================================================================================
        DETAIL TITLE
      =====================================================================================
      -->
      <v-flex xs4 sm3 md2>
        <div class="info--text font-weight-medium" v-html="detail.title" />
      </v-flex>
      <!--
      =====================================================================================
        DETAIL INFO
      =====================================================================================
      -->
      <v-flex xs7 sm8 md9 pr-0 v-if="!detail.txInput">
        <div v-if="isLoading">
          <v-flex xs12 style="background: #e6e6e6; height: 12px; border-radius: 2px;"></v-flex>
        </div>
        <div v-else>
          <div v-if="!isMono">
          <router-link v-if="detail.link" :to="detail.link">
            <div class="text-truncate secondary--text" v-html="detail.detail"></div>
          </router-link>
          <div v-else class="text-muted text-truncate" v-html="detail.detail"></div>
          </div>
          <div v-else>
            <app-hash-concat v-if="detail.link" :hash="detail.detail" :link="detail.link" />
            <app-hash-concat v-else :hash="detail.detail" :isBlue="false"/>
          </div>
        </div>
      </v-flex>
      <v-flex xs1 pt-0 pb-0 pl-1 v-if="!detail.txInput">
        <app-copy-to-clip v-if="detail.copy" :value-to-copy="detail.detail" />
      </v-flex>
      <v-flex hidden-xs-only sm9 md10 v-if="detail.txInput">
        <div class="data-input pa-3">
          <p v-for="(item, index) in detail.txInput" :key="index" class="mb-2">{{ item }}</p>
        </div>
      </v-flex>
    </v-layout>
    <v-layout v-if="detail.txInput" align-start justify-start row class="mr-2 ml-2">
      <v-flex xs12 hidden-sm-and-up pt-0>
        <div class="data-input pa-3">
          <p v-for="(item, index) in detail.txInput" :key="index" class="mb-2">{{ item }}</p>
        </div>
      </v-flex>
    </v-layout>
  </div>
</template>

<script lang="ts">
import { Detail } from '@app/core/components/props'
import { Vue, Component, Prop } from 'vue-property-decorator'
import AppCopyToClip from '@app/core/components/ui/AppCopyToClip.vue'
import AppHashConcat from '@app/core/components/ui/AppHashConcat.vue'


@Component({
  components: {
    AppCopyToClip,
    AppHashConcat
  }
})
export default class AppDetailsListRow extends Vue {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop(Object) detail!: Detail
  @Prop(Boolean) isLoading!: boolean

  /*
  ===================================================================================
    Computed
  ===================================================================================
  */

  get isMono(): boolean  {
    console.log(this.detail)
    return this.detail.mono ? true : false
  }
}
</script>

<style scoped lang="css">
.data-input {
  border: 1.2px solid #dee5f0;
  border-radius: 5px;
}
</style>
