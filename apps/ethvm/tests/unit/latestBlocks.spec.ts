import { shallowMount, createLocalVue } from '@vue/test-utils'
import LatestBlocks from '@/components/blocks/largeBlocks/latestBlocks.vue'
import store from '@app/states'
import Vuex from 'vuex'
import en_US from '@app/translations/en_US.json'
import VueI18n from 'vue-i18n'
import Vuetify from 'vuetify'
import footnote from '@/components/blocks/smallBlocks/footnote.vue'
import {Events} from 'ethvm-common'
import router from '@app/router'

const defaultLocale: string = 'en_US'
const messages: any = {
  en_US
}

const localVue = createLocalVue()
localVue.prototype.$eventHub = new localVue()
localVue.use(Vuex)
localVue.use(VueI18n)
localVue.use(Vuetify)
localVue.component('footnote', footnote)

const i18n = new VueI18n({
  locale: defaultLocale,
  messages,
  fallbackLocale: 'en_US'
})

let block = [{"header":{"parentHash":"8bb7d921ab891a4f38030709ac1422e48743f6856299f42cc6c9c19b4e8a0483","unclesHash":"1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347","timestamp":1439797387,"nonce":"ee47d7067a0481a3","miner":"3d5292e9d2a2d31014717ff936a0f9375a5cc8b7","difficulty":3847463540790,"totalDifficulty":0,"stateRoot":{},"transactionsRoot":{},"receiptsRoot":{},"logsBloom":{},"gasLimit":3141592,"gasUsed":0,"mixHash":{},"extraData":{},"rewards":{"3d5292e9d2a2d31014717ff936a0f9375a5cc8b7":5000000000000000000}},"stats":{"processingTimeMs":28000,"successfulTxs":0,"failedTxs":0,"pendingTxs":0,"txs":0,"internalTxs":0,"avgGasPrice":0,"avgTxsFees":0,"totalGasPrice":0,"totalTxsFees":0},"number":99901,"transactions":[],"uncles":[]}]

describe('latestBlocks.vue', () => {
  it('renders LatestBlocks', () => {
    const wrapper = shallowMount(LatestBlocks, {
      propsData: { blocks: [] },
      localVue,
      i18n,
      router,
      store
    })
    wrapper.vm.$store.commit(Events.newBlock, block)
    expect(wrapper.isVueInstance()).toBeTruthy()
    expect(wrapper.text()).toMatch('0x3d5292e9d2a2d31014717ff936a0f9375a5cc8b7')
    expect(wrapper.text()).toMatch('3d5292e9d2a2d31014717ff936a0f9375a5cc8b7')
    expect(wrapper.text()).toMatch('500000000000000000')
  })
})


