<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="crumbs" />
    <v-layout row wrap justify-start class="mb-4">
      <v-flex xs12>
        <app-details-list :title="title" :details="uncleDetails" :is-loading="isLoading" :error="error" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import AppDetailsList from '@app/core/components/ui/AppDetailsList.vue'
import { eth } from '@app/core/helper'
import { Uncle } from '@app/core/models'
import { Vue, Component, Prop, Mixins } from 'vue-property-decorator'
import { Detail, Crumb } from '@app/core/components/props'

@Component({
  components: {
    AppBreadCrumbs,
    AppDetailsList
  }
})
export default class PageDetailsUncle extends Vue {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop({ type: String }) uncleRef!: string

  /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

  uncle = {} as Uncle
  timestamp = new Date()
  error = ''

  /*
  ===================================================================================
    Lifecycle
  ===================================================================================
  */

  created() {
    const ref = this.uncleRef

    // 1. Check that current uncle ref is valid one
    if (!eth.isValidHash(ref)) {
      this.error = this.$i18n.t('message.invalid.uncle').toString()
      return
    }

    // 2. Fetch uncle
    this.fetchUncle()
  }

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  fetchUncle() {
    this.$api
      .getUncle(this.uncleRef)
      .then(uncle => {
        if (uncle === null) {
          this.error = this.$i18n.t('message.invalid.uncle').toString()
          return
        }
        this.setUncleInfo(uncle)
      })
      .catch(err => (this.error = this.$i18n.t('message.invalid.uncle').toString()))
  }

  setUncleInfo(uncle: Uncle) {
    this.uncle = uncle
    this.timestamp = this.uncle.getTimestamp()
  }

  /*
  ===================================================================================
    Computed
  ===================================================================================
  */

  /**
   * Return the title for the details list.
   *
   * @return {String}
   */
  get title(): string {
    return this.$i18n.t('uncle.detail').toString()
  }

  /**
   * Return properly formatted Details[] array for the details table.
   * If the data hasn't been loaded yet, then only include the titles in the details.
   *
   * @return {Detail[]}
   */
  get uncleDetails(): Detail[] {
    let details: Detail[]
    if (this.isLoading) {
      details = [
        {
          title: this.$i18n.t('uncle.height')
        },
        {
          title: this.$i18n.t('uncle.position')
        },
        {
          title: this.$i18n.t('uncle.included')
        },
        {
          title: this.$i18n.t('common.hash')
        },
        {
          title: this.$i18n.t('block.p-hash')
        },
        {
          title: this.$i18n.tc('miner.name', 2)
        },
        {
          title: this.$i18n.t('common.timestmp')
        },
        {
          title: this.$i18n.t('common.sha')
        },
        {
          title: this.$i18n.t('gas.limit')
        },
        {
          title: this.$i18n.t('gas.used')
        }
      ]
    } else {
      details = [
        {
          title: this.$i18n.t('uncle.height'),
          detail: this.uncle.getNumber()
        },
        {
          title: this.$i18n.t('uncle.position'),
          detail: this.uncle.getPosition()
        },
        {
          title: this.$i18n.t('uncle.included'),
          detail: this.uncle.getBlockHeight(),
          link: '/block/' + this.uncle.getBlockHeight()
        },
        {
          title: this.$i18n.t('common.hash'),
          detail: this.uncle.getHash(),
          copy: true,
          mono: true
        },
        {
          title: this.$i18n.t('block.p-hash'),
          detail: this.uncle.getParentHash().toString(),
          mono: true
        },
        {
          title: this.$i18n.tc('miner.name', 1),
          detail: this.uncle.getMiner().toString(),
          link: '/address/' + this.uncle.getMiner().toString(),
          copy: true,
          mono: true
        },
        {
          title: this.$i18n.t('common.timestmp'),
          detail: this.$i18n.d(this.timestamp, 'long', this.$i18n.locale.replace('_', '-'))
        },
        {
          title: this.$i18n.t('common.sha'),
          detail: this.uncle.getSha3Uncles().toString(),
          mono: true
        },
        {
          title: this.$i18n.t('gas.limit'),
          detail: this.uncle.getGasLimit().toNumber()
        },
        {
          title: this.$i18n.t('gas.used'),
          detail: this.uncle.getGasUsed().toNumber()
        }
      ]
    }
    return details
  }

  /**
   * Returns breadcrumbs entry for this particular view.
   * Required for AppBreadCrumbs
   *
   * @return {Array} - Breadcrumb entry. See description.
   */
  get crumbs(): Crumb[] {
    return [
      {
        text: 'uncle.name',
        disabled: false,
        link: '/uncles',
        plural: 2
      },
      {
        text: 'uncle.name',
        disabled: true,
        plural: 1,
        label: `: ${this.uncleRef}`
      }
    ]
  }

  /**
   * Determines whether or not the uncle object has been loaded/populated.
   *
   * @return {Boolean}
   */
  get isLoading(): boolean {
    return Object.keys(this.uncle).length === 0
  }

  /**
   * Determines whether or not component has an error.
   * If error property is empty string, there is no error.
   *
   * @return {Boolean} - Whether or not error exists
   */
  get hasError(): boolean {
    return this.error !== ''
  }
}
</script>
