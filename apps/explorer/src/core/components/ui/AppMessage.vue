<template>
  <transition name="fade">
    <v-footer v-if="show" fixed color="transparent" height="auto">
      <v-layout>
        <v-flex xs12>
          <transition-group name="fade" group mode="out-in">
            <v-card class="footer-content" color="sync" flat key="large" :class="hide ? 'footer-hidden' : ''">
              <v-layout row wrap class="pl-4 pr-4 pt-3 pb-3" align-center justify-center>
                <v-flex shrink pl-2 pr-2>
                  <v-img :src="require('@/assets/icon-warning.png')" width="30px" height="30px" contain />
                </v-flex>
                <v-flex grow>
                  <p v-for="(message, i) in messages" :key="i"  class="black--text font-italic">{{ message }}</p>
                </v-flex>
                <v-flex shrink>
                  <v-btn outline color="primary" class="text-capitalize" @click="hide = true">Got It</v-btn>
                </v-flex>
              </v-layout>
            </v-card>
            <v-layout v-if="hide" align-center justify-end key="small">
              <v-tooltip left>
                <template v-slot:activator="{ on }">
                  <v-img :src="require('@/assets/icon-warning-outline.png')" max-width="50px" height="50px" contain @click="hide = false" v-on="on" />
                </template>
                <span>{{ $t('btn.details') }}</span>
              </v-tooltip>
            </v-layout>
          </transition-group>
        </v-flex>
      </v-layout>
    </v-footer>
  </transition>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator'
import debounce from 'lodash.debounce'
import { TranslateResult } from 'vue-i18n';
import { connect } from 'http2';
@Component
export default class AppMessage extends Vue {

  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop(Boolean) syncing?: boolean
  @Prop(Boolean) connected?: boolean

  /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

  hide: boolean = false
  show: boolean = false
  debouncedShow = debounce(this.setShow, 1000)

  created(){
    if(this.syncing || this.connected) {
      this.debouncedShow()
    }
  }

  /*
  ===================================================================================
    Watch
  ===================================================================================
  */

  @Watch('temp')
  onTempChanged(): void {
    this.debouncedShow()
  }

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  setShow(): void {
    this.show = (this.syncing || this.connected) || false
  }

  /*
  ===================================================================================
   Computed
  ===================================================================================
  */

  get messages(): TranslateResult[]  {
    let newMes: TranslateResult[] = new Array()
    if (this.syncing)  {
      newMes.push(this.$t('message.sync.main'))
    }
    if (this.connected) {
      newMes.push(this.$t('message.disconnected'))
    }
    console.log(newMes)
    return newMes
  }


}
</script>

<style lang="css">
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform: translateY(30px);
}

.footer-content {
  transition: all 0.5s ease;
  bottom: 0px;
}

.footer-hidden {
  bottom: -300px;
  transition: all 0.5s ease-in;
}
</style>
