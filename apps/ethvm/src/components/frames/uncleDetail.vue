<template>
  <v-container v-if="block != null" grid-list-lg class="mt-0">
    <v-card fluid flat color="transparent">
      <v-breadcrumbs large>
        <v-icon slot="divider">fa fa-arrow-right</v-icon>
        <v-breadcrumbs-item v-for="item in items" :disabled="item.disabled" :key="item.text" :to="item.link"> {{ item.text }} </v-breadcrumbs-item>
      </v-breadcrumbs>
    </v-card>
    <h4 class="mt-5">{{ $t('title.blockDetail') }}</h4>
    <block-block-detail :block="block" :uncles="uncles"></block-block-detail>
  </v-container>
</template>

<script lang="ts">
import { common } from '@app/helpers'
import { Uncle } from '@app/models'
import { Events as sEvents } from 'ethvm-common'
import store from '@app/states'
import Vue from 'vue'

export default Vue.extend({
  name: 'Uncle',
  props: ['blockHash'],
  data() {
    return {
      common,
      store,
      uncle: null,
      items: [
        {
          text: this.$i18n.t('title.home'),
          disabled: false,
          link: '/'
        },
        {
          text: 'Uncles',
          disabled: false,
          link: '/blocks'
        }
      ],
      details: []
    }
  },
  methods: {
    setItems(num) {
      const newText = this.$i18n.t('title.blockN') + ' ' + num
      const newI = {
        text: newText,
        disabled: false,
        link: '/'
      }
      this.items.push(newI)
    }
  },
  computed: {},
  mounted() {
    /* Get Block Data: */
    this.$socket.emit(
      sEvents.getUncle,
      {
        hash: this.blockHash.replace('0x', '')
      },
      (error, result) => {
        if (result) {
          this.block = new Uncle(result)
        }
      }
    )
  }
})
</script>

<style scoped lang="less">
@import '~lessPath/sunil/global.less';
</style>
