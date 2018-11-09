import { shallowMount, createLocalVue } from '@vue/test-utils'
import LatestBlocks from '@/components/blocks/largeBlocks/latestBlocks.vue'
import store from '@app/states'
import Vuex from 'vuex'
import en_US from '@app/translations/en_US.json'
import VueI18n from 'vue-i18n'
import Vuetify from 'vuetify'
import footnote from '@/components/blocks/smallBlocks/footnote.vue'

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

describe('latestBlocks.vue', () => {
  it('renders LatestBlocks', () => {
    const wrapper = shallowMount(LatestBlocks, {
      propsData: { blocks: [] },
      localVue,
      i18n,
      store
    })
    //expect(wrapper.text()).toMatch('msg')
  })
})


