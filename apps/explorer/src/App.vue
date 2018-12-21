<template>
  <v-app style="background: #f3f4f8;">
    <the-navigation-drawer />
    <v-content>
      <router-view></router-view>
      <!--<router-view :key="$route.fullPath"/ -->
      <the-footer />
    </v-content>
  </v-app>
</template>

<script lang="ts">
import 'vuetify/dist/vuetify.min.css'
import { Block, Tx, PendingTx } from '@app/models'
import { Events as sEvents } from 'ethvm-common'
import TheNavigationDrawer from '@app/components/app-layout/TheNavigationDrawer.vue'
import TheFooter from '@app/components/app-layout/TheFooter.vue'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  components: {
    TheNavigationDrawer,
    TheFooter
  }
})
export default class App extends Vue {
  name: 'app'

  //Add footer + nav declaration
  data() {
    return {}
  }

  created() {
    this.$options.sockets.connect = () => {
      if (!this.pageName || this.pageName === 'blocks' || this.pageName === 'transactions') {
        this.setPastData()
      } else {
        setTimeout(() => {
          this.setPastData()
        }, 1000)
      }
    }
  }

  // Methods
  setPastData() {
    this.$socket.emit(
      sEvents.pastTxs,
      {
        limit: 100,
        page: 0
      },
      (err, txs) => {
        this.$store.commit(sEvents.newTx, txs)
        if (txs && txs.length > 0) {
          this.$eventHub.$emit(sEvents.pastTxsR)
          this.$eventHub.$emit(sEvents.newTx, new Tx(txs[0]))
        }
      }
    )
    this.$socket.emit(
      sEvents.pastBlocks,
      {
        limit: 100,
        page: 0
      },
      (err, blocks) => {
        this.$store.commit(sEvents.newBlock, blocks)
        if (blocks && blocks.length > 0) {
          this.$eventHub.$emit(sEvents.newBlock, new Block(blocks[0]))
          this.$eventHub.$emit(sEvents.pastBlocksR)
        }
      }
    )
    this.$socket.emit(
      sEvents.pendingTxs,
      {
        limit: 100,
        page: 0
      },
      (err, pTxs) => {
        this.$store.commit(sEvents.newPendingTx, pTxs)
        if (pTxs && pTxs.length > 0) {
          this.$eventHub.$emit(sEvents.newPendingTx)
        }
      }
    )

    this.$socket.emit(
      sEvents.getUncles,
      {
        limit: 100,
        page: 0
      },
      (err, uncles) => {
        this.$store.commit(sEvents.newUncle, uncles)
        if (uncles && uncles.length > 0) {
          this.$eventHub.$emit(sEvents.newUncle)
        }
      }
    )
  }

  // Computed
  get pageName() {
    return this.$route.params.pageName
  }

  get param() {
    return this.$route.params.param
  }

  get holder() {
    return this.$route.params.holder
  }
}
</script>

<style scoped lang="css">
@import '~cssPath/global.css';
</style>
