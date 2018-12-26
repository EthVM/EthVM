import { shallowMount, createLocalVue, mount } from '@vue/test-utils'
import AddressDetail from '@/components/blocks/largeBlocks/addressDetail.vue'
import store from '@app/states'
import copyToClipComponent from '@app/components/blocks/smallBlocks/copyToClipComponent.vue'
import Vuex from 'vuex'
import en_US from '@app/translations/en_US.json'
import VueI18n from 'vue-i18n'
import Vuetify from 'vuetify'
import footnote from '@/components/blocks/smallBlocks/footnote.vue'
import blockies from '@app/components/blocks/smallBlocks/blockies.vue'
import router from '@app/router'
import { Account } from '@app/models'
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
// localVue.component('address-qr', addressQR)
localVue.component('blockies', blockies)
localVue.component('copy-to-clip-component', copyToClipComponent)

const i18n = new VueI18n({
  locale: defaultLocale,
  messages,
  fallbackLocale: 'en_US'
})

const acc = new Account({ address: 'e6a7a1d47ff21b6321162aea7c6cb457d5476bca', balance: 8888, nonce: 8 })

describe.skip('addressDetail.vue', () => {
  it('renders addressDetail', () => {
    const wrapper = mount(AddressDetail, {
      propsData: { account: acc },
      localVue,
      i18n,
      router,
      store
    })
    expect(wrapper.isVueInstance()).toBeTruthy()
    expect(wrapper.text()).toMatch('e6a7a1d47ff21b6321162aea7c6cb457d5476bca')
  })
})
