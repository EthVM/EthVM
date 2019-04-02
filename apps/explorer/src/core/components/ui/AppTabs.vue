<template>
  <v-card color="white" flat>
 <v-layout pa-2>
   <!--
    =====================================================================================
      Mobile
    =====================================================================================
    -->
      <v-flex hidden-sm-and-up>
        <div class="mobile-select">
        <v-select
        v-model="activeTabId"
        :items="tabs"
        item-text="title"
        item-value="id"
        color="accent"
        solo flat
        @change="setTab"
        height="32"
        hide-details

        ></v-select>
        </div>


        <!-- <v-select v-model="activeMobile" :items="tabs" item-text="title" item-value="id" @change="setTab" solo flat class="lang-select" /> -->
          <!-- <div>
    <v-btn block outline large slot="activator" color="secondary" class="text-capitalize pl-1 pr-1" small @click.native.stop="dialog = true">
      <v-layout row justify-start align-center>
          <p class="body-2 mb-0 font-weight-regular">{{  mobileActive }}</p>
      </v-layout>
    </v-btn>
    <v-dialog v-model="dialog" full-width>
      <v-card>
        <v-layout row  class="pl-3 pr-3 pt-3">
          <v-spacer />
          <v-flex xs1 mr-3>
            <v-btn icon @click="dialog = false">
              <v-icon class="info--text fas fa-times " />
            </v-btn>
          </v-flex>
        </v-layout>
        <v-divider class="lineGrey"></v-divider>
        <v-list class="pb-3">
          <v-list-tile v-for="tab in tabs" :key="tab.id" class="pl-0" @click="setTab(tab)">
            <v-layout row justify-start align-center fill-height>
              <v-flex xs12>
                <v-card-title :class="[activeTab === `tab-${tab.id}` ? 'black--text' : 'info--text']">{{ tab.title }}</v-card-title>
              </v-flex>
            </v-layout>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-dialog>
          </div> -->
      </v-flex>
 <!--
    =====================================================================================
      Desktop
    =====================================================================================
    -->
    <v-flex hidden-xs-only>

    <v-tabs
      v-model="activeTab"
      color="white"
      show-arrows
      :class="{ 'pl-0 pr-0': $vuetify.breakpoint.smAndDown, 'pl-3 pr-3 pt-2': $vuetify.breakpoint.mdAndUp }"
    >

      <v-tab
        v-for="item in tabs"
        class="info--text text-capitalize pb-2 tab-opacity"
        active-class="primary--text "
        :key="item.id"
        :href="'#tab-' + item.id"
        ripple
        >{{ item.title }}</v-tab
      >
      <v-tabs-slider color="primary" class="mb-0" style="height: 4px;" />


    </v-tabs>
     </v-flex>
     </v-layout>
    <v-tabs-items v-model="activeTab" style="border-top: 1px solid #efefef">
      <v-container grid-list-xs class="mb-0 pa-2"> <slot name="tabs-item"/></v-container>
    </v-tabs-items>




  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Tab } from '@app/core/components/props'
import { TranslateResult } from 'vue-i18n'

@Component
export default class AppTabs extends Vue {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop(Array) tabs!: Tab[]

  /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

  activeTab = 'tab-0'
  activeTabId = 0

  setTab() {
    this.tabs.forEach( tab => {
      if (this.activeTabId === tab.id) {
         tab.isActive = true
         this.activeTab = `tab-${this.activeTabId}`
      }
      else {
         tab.isActive = false
      }
    })
  }

}
</script>


<style scoped lang="css">
.mobile-select{
  border: 1px solid #4a67c6;
  border-radius: 2px;
  padding: 10px;
  color: #4a67c6;
}
.v-select__selections, .v-select__selection .v-select__selection--comma{
  color: green;
}

</style>
