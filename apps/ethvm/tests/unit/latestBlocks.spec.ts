import { shallowMount, createLocalVue } from '@vue/test-utils'
import LatestBlocks from '@/components/blocks/largeBlocks/latestBlocks.vue'
import store from '../../src/states'
import Vuex from 'vuex'


const localVue = createLocalVue()
localVue.prototype.$eventHub = new localVue()
localVue.use(Vuex)

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
      store
    })
    //expect(wrapper.text()).toMatch('msg')
  })
})


