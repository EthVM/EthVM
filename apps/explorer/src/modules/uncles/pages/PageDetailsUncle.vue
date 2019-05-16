<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="crumbs" />
    <v-layout row wrap justify-start class="mb-4">
      <v-flex xs12>
        <app-details-list :title="title" :details="uncleDetails" :is-loading="loading" :error="error" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import AppDetailsList from '@app/core/components/ui/AppDetailsList.vue'
import { eth } from '@app/core/helper'
import { Detail, Crumb } from '@app/core/components/props'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { uncleByHash } from '@app/modules/uncles/uncles.graphql'
import { UncleDetailExt } from '@app/core/api/apollo/extensions/uncle-detail.ext'

@Component({
  components: {
    AppBreadCrumbs,
    AppDetailsList
  },
  apollo: {
    uncleDetail: {
      query() {
        const self = this as any
        const validHash = eth.isValidHash(self.uncleRef)
        if (!validHash) {
          self.error = this.$i18n.t('message.invalid.uncle')
          return null
        }
        return uncleByHash
      },
      variables() {
        return { hash: this.uncleRef }
      },
      update({ uncleDetail }) {
        if (uncleDetail) {
          return new UncleDetailExt(uncleDetail)
        }
        this.error = this.error || this.$i18n.t('message.invalid.uncle')
        return null
      },
      error({ graphQLErrors, networkError }) {
        // TODO refine
        if (networkError) {
          this.error = this.$i18n.t('message.invalid.uncle')
        }
      }
    }
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

  uncleDetail?: UncleDetailExt
  error = ''

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
    if (this.loading) {
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
      if (!this.uncleDetail) {
        this.error = this.$i18n.t('message.invalid.uncle').toString()
        return []
      }
      details = [
        {
          title: this.$i18n.t('uncle.height'),
          detail: this.uncleDetail.numberBN.toString()
        },
        {
          title: this.$i18n.t('uncle.position'),
          detail: this.uncleDetail.uncleIndex
        },
        {
          title: this.$i18n.t('uncle.included'),
          detail: this.uncleDetail.nephewNumberBN.toString(),
          link: `/block/${this.uncleDetail.nephewNumberBN.toString()}`
        },
        {
          title: this.$i18n.t('common.hash'),
          detail: this.uncleDetail.hash,
          copy: true,
          mono: true
        },
        {
          title: this.$i18n.t('block.p-hash'),
          detail: this.uncleDetail.parentHash,
          mono: true
        },
        {
          title: this.$i18n.tc('miner.name', 1),
          detail: this.uncleDetail.author,
          link: `/address/${this.uncleDetail.author}`,
          copy: true,
          mono: true
        },
        {
          title: this.$i18n.t('common.timestmp'),
          detail: this.$i18n.d(this.uncleDetail.timestampMs, 'long', this.$i18n.locale.replace('_', '-'))
        },
        {
          title: this.$i18n.t('common.sha'),
          detail: this.uncleDetail.sha3Uncles,
          mono: true
        },
        {
          title: this.$i18n.t('gas.limit'),
          detail: this.uncleDetail.gasLimitBN.toString()
        },
        {
          title: this.$i18n.t('gas.used'),
          detail: this.uncleDetail.gasUsedBN.toString()
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
        label: {
          name: `${this.uncleRef}`,
          hash: true
        }
      }
    ]
  }

  /**
   * Determines whether or not the uncle object has been loaded/populated.
   *
   * @return {Boolean}
   */
  get loading() {
    return this.$apollo.loading
  }
}
</script>
