import { shallowMount, createLocalVue } from '@vue/test-utils'
import LatestBlocks from '@/components/blocks/largeBlocks/latestBlocks.vue'
import store from '../../src/states'
import Vuex from 'vuex'
import en_US from '../../src/translations/en_US.json'
 import VueI18n from 'vue-i18n'

const defaultLocale: string = 'en_US'
const messages: any = {
  en_US
}

const localVue = createLocalVue()
localVue.prototype.$eventHub = new localVue()
localVue.use(Vuex)
localVue.use(VueI18n)

const i18n = new VueI18n({
  locale: defaultLocale,
  messages,
  fallbackLocale: 'en_US'
})


describe('latestBlocks.vue', () => {
  let getters
  let store

  beforeEach(() => {
    getters = {
      getBlocks: () => []
    }

    store = new Vuex.Store({
      getters
    })
  })

  it('renders LatestBlocks', () => {
    const wrapper = shallowMount(LatestBlocks, {
      propsData: { blocks: [] },
      mocks: {
        $t: () => 'footer'
      },
      localVue,
      i18n,
      store
    })
    //expect(wrapper.text()).toMatch('msg')
  })
})


