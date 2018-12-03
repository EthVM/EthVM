import { shallowMount, createLocalVue, mount } from '@vue/test-utils'
import BlockDetail from '@/components/blocks/largeBlocks/blockDetail.vue'
import store from '@app/states'
import copyToClipComponent from '@app/components/blocks/smallBlocks/copyToClipComponent.vue'
import Vuex from 'vuex'
import en_US from '@app/translations/en_US.json'
import VueI18n from 'vue-i18n'
import Vuetify from 'vuetify'
import footnote from '@/components/blocks/smallBlocks/footnote.vue'
import {Events} from 'ethvm-common'
import router from '@app/router'
import { Block } from '@app/models'
import VueTimeago from 'vue-timeago'

const defaultLocale: string = 'en_US'
const messages: any = {
  en_US
}

const localVue = createLocalVue()
localVue.prototype.$eventHub = new localVue()
localVue.use(Vuex)
localVue.use(VueI18n)
localVue.use(Vuetify)
localVue.use(VueTimeago, {
  name: 'timeago',
  locale: 'en-US',
  locales: {
    'en-US': require('date-fns/locale/en')
  }
})
localVue.component('footnote', footnote)
localVue.component('copy-to-clip-component', copyToClipComponent)

const i18n = new VueI18n({
  locale: defaultLocale,
  messages,
  fallbackLocale: 'en_US'
})

let b = new Block({number:43,hash:'blovkhash',header:{parentHash:'gg',miner:'minerhash',rewards:{},stateRoot:Buffer.from(''),receiptsRoot:Buffer.from(''),transactionsRoot:Buffer.from('9'),unclesHash:'',logsBloom:Buffer.from('')},stats:{},uncles:[],transactions:[]})

describe.skip('blockDetail.vue', () => {
  it('renders blockDetail', () => {
    const wrapper = mount(BlockDetail, {
      propsData: { block: b, uncle : []},
      localVue,
      i18n,
      router,
      store
    })
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})


