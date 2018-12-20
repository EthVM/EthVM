<template>
  <v-card color="white" flat class="pt-3 pr-4 pl-4 mt-0">
    <v-layout v-if="showStyle == ''" row wrap align-center pb-1>
      <v-flex d-flex xs12 sm8 order-xs1>
        <v-card-title class="title font-weight-bold">{{ getTitle }}</v-card-title>
      </v-flex>
      <v-flex hidden-sm-and-down md4 order-xs2>
        <v-layout justify-end>
          <app-footnotes :footnotes="footnote"/>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-layout v-else row wrap align-center pb-1>
      <v-flex d-flex xs8 md7 order-xs1>
        <v-card-title class="title font-weight-bold">{{ $t('title.lastBlock') }}</v-card-title>
      </v-flex>
      <v-flex hidden-sm-and-down md4 order-md2>
        <v-layout justify-center>
          <app-footnotes :footnotes="footnote"/>
        </v-layout>
      </v-flex>
      <v-flex d-flex xs4 md1 order-xs2 order-md3>
        <v-layout justify-end>
          <v-btn
            outline
            color="secondary"
            class="text-capitalize"
            to="/blocks"
          >{{ $t('bttn.viewAll') }}</v-btn>
        </v-layout>
      </v-flex>
    </v-layout>
    <!-- Table Header -->
    <v-card color="info" flat class="white--text pl-3 pr-1" height="40px" style="margin-right: 1px">
      <v-layout align-center justify-start row fill-height pr-3>
        <v-flex xs6 sm2 md3 lg2>
          <h5>{{ $t('tableHeader.blockN') }}</h5>
        </v-flex>
        <v-spacer></v-spacer>
        <v-flex v-if="blocks[0].getType() == 'uncle'" hidden-sm-and-down md2>
          <h5>{{ $t('title.position') }}</h5>
        </v-flex>
        <v-flex v-else hidden-sm-and-down md2>
          <h5>{{ $t('tableHeader.txs') }}</h5>
        </v-flex>
        <v-flex xs6 sm3 md2>
          <h5>{{ $t('tableHeader.reward') }}</h5>
        </v-flex>
      </v-layout>
    </v-card>
    <!-- End Table Header -->
    <v-card v-if="blocks" flat id="scroll-target" :style="getStyle" class="scroll-y pt-0 pb-0">
      <v-layout column fill-height v-scroll:#scroll-target class="pt-1" style="margin-right: 1px">
        <v-flex xs12>
          <transition-group name="list" tag="p">
            <v-card v-for="block in blocks" class="transparent" flat v-bind:key="block.getHash()">
              <table-blocks-row :block="block"></table-blocks-row>
              <v-divider></v-divider>
            </v-card>
          </transition-group>
        </v-flex>
      </v-layout>
    </v-card>
    <div v-else>
      <v-card flat mb-4>
        <v-card-text class="text-xs-center text-muted">{{ $t('message.error') }}</v-card-text>
      </v-card>
    </div>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import AppFootnotes from '@app/components/ui/AppFootnotes.vue'
import TableBlocksRow from '@app/components/tables/TableBlocksRow.vue'
export default Vue.extend({
  name: 'TableBlocks',
  props: {
    frameBlocks: {
      type: Boolean,
      default: true
    },
    showStyle: {
      type: String,
      default: ''
    },
    blocks: {
      type: Array
    }
  },
  components: {
    AppFootnotes,
    TableBlocksRow
  },
  data() {
    return {
      footnote: [
        {
          color: 'txSuccess',
          text: this.$i18n.t('footnote.success'),
          icon: 'fa fa-circle'
        },
        {
          color: 'txFail',
          text: this.$i18n.t('footnote.failed'),
          icon: 'fa fa-circle'
        }
      ]
    }
  },

  computed: {
    getStyle() {
      return this.showStyle
    },
    getTitle() {
      return this.frameBlocks ? this.$i18n.t('title.blocks') : this.$i18n.t('title.uncles')
    }
  }
})
</script>
