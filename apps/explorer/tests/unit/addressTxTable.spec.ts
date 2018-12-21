import { shallowMount, createLocalVue, mount } from '@vue/test-utils'
import AddressDetail from '@/components/blocks/largeBlocks/addressTxTable.vue'
import store from '@app/states'
import copyToClipComponent from '@app/components/blocks/smallBlocks/copyToClipComponent.vue'
import Vuex from 'vuex'
import en_US from '@app/translations/en_US.json'
import VueI18n from 'vue-i18n'
import Vuetify from 'vuetify'
import footnote from '@/components/blocks/smallBlocks/footnote.vue'
import blockies from '@app/components/blocks/smallBlocks/blockies.vue'
import router from '@app/router'
import { Account, Tx } from '@app/models'
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
localVue.component('blockies', blockies)
localVue.component('copy-to-clip-component', copyToClipComponent)

const i18n = new VueI18n({
  locale: defaultLocale,
  messages,
  fallbackLocale: 'en_US'
})

const t = new Tx({
  hash: 'f1b7e1da6c42730780a7393c8ab7a57ad0649222f07c7a1abc90d8246053074b',
  from: 'e6a7a1d47ff21b6321162aea7c6cb457d5476bca',
  value: Buffer.from('989'),
  to: 'a971748c4c493bc96c7d490e1789481e1e96bb10'
})
const transactions = [t]

describe('addressTxTable.vue', () => {
  it('renders addressTxTable', () => {
    const wrapper = mount(AddressDetail, {
      propsData: { account: 'e6a7a1d47ff21b6321162aea7c6cb457d5476bca', transactions: transactions, total: 1 },
      localVue,
      i18n,
      router,
      store
    })
    expect(wrapper.isVueInstance()).toBeTruthy()
    expect(wrapper.text()).toMatch('e6a7a1d47ff21b6321162aea7c6cb457d5476bca')
  })
})
