import { shallowMount, createLocalVue, mount } from '@vue/test-utils'
import blockLastTransactions from '@/components/blocks/largeBlocks/lastTransactions.vue'
import blockLastBlock from '@/components/blocks/smallBlocks/lastBlock.vue'
import successfulTxSmallBlock from '@app/components/blocks/smallBlocks/successfulTxSmallBlock.vue'
import failedTxSmallBlock from '@app/components/blocks/smallBlocks/failedTxSmallBlock.vue'
import pendingTxSmallBlock from '@app/components/blocks/smallBlocks/pendingTxSmallBlock.vue'

import store from '@app/states'
import Vuex from 'vuex'
import en_US from '@app/translations/en_US.json'
import VueI18n from 'vue-i18n'
import Vuetify from 'vuetify'
import footnote from '@/components/blocks/smallBlocks/footnote.vue'
import router from '@app/router'
import { Tx } from '@app/models'

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
localVue.component('successful-tx-small-block', successfulTxSmallBlock)
localVue.component('failed-tx-small-block', failedTxSmallBlock)
localVue.component('pending-tx-small-block', pendingTxSmallBlock)
localVue.component('block-last-block', blockLastBlock)
localVue.component('block-last-transactions', blockLastTransactions)

const i18n = new VueI18n({
  locale: defaultLocale,
  messages,
  fallbackLocale: 'en_US'
})

let t =  new Tx({hash:'f1b7e1da6c42730780a7393c8ab7a57ad0649222f07c7a1abc90d8246053074b',from:'e6a7a1d47ff21b6321162aea7c6cb457d5476bca',value:Buffer.from('989'),to:'a971748c4c493bc96c7d490e1789481e1e96bb10'})
let transactions = [t]

describe('lastTransactions.vue', () => {
  it('renders transactions', () => {
    const wrapper = mount(blockLastTransactions, {
      propsData: { transactions: transactions },
      localVue,
      i18n,
      router
    })

    expect(wrapper.isVueInstance()).toBeTruthy()
    expect(wrapper.html()).toMatch('f1b7e1da6c42730780a7393c8ab7a57ad0649222f07c7a1abc90d8246053074b')
    expect(wrapper.text()).toMatch('e6a7a1d47ff21b6321162aea7c6cb457d5476bca')
    expect(wrapper.text()).toMatch('a971748c4c493bc96c7d490e1789481e1e96bb10')
  })
})


