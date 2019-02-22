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
import AppListTitle from '@app/core/components/ui/AppListTitle.vue'
import { Events } from 'ethvm-common'
import { eth } from '@app/core/helper'
import { Uncle } from '@app/core/models'
import { Vue, Component, Prop, Mixins } from 'vue-property-decorator'
import { Detail } from '@app/core/components/props'

@Component({
  components: {
    AppBreadCrumbs,
    AppDetailsList
  }
})
export default class PageDetailsUncle extends Vue {
  @Prop({ type: String }) uncleRef!: string

  uncle = {} as Uncle
  timestamp = ''
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
      this.error = this.$i18n.t('message.invalidHash').toString()
      return
    }

    // 2. Check that we have our uncle in the store
    const uncle = this.$store.getters.uncleByHash(ref)

    // 3. Depending on previous state, we display directly or not
    if (uncle) {
      this.setUncleInfo(uncle)
    } else {
      this.fetchUncle()
    }
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
          this.error = this.$i18n.t('message.invalidUncle').toString()
          return
        }
        this.setUncleInfo(uncle)
      })
      .catch(err => (this.error = this.$i18n.t('message.invalidUncle').toString()))
  }

  setUncleInfo(uncle: Uncle) {
    this.uncle = uncle
    this.timestamp = this.uncle.getTimestamp().toString()
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
    return this.$i18n.t('title.uncleDetail').toString()
  }

  /**
   * Return properly formatted Details[] array for the details table.
   * If the data hasn't been loaded yet, then only include the titles in the details.
   *
   * @return {Detail[]}
   */
  get uncleDetails(): Detail[] {
    let details
    if (this.isLoading) {
      details = [
        {
          title: this.$i18n.t('tableHeader.uncleHeight')
        },
        {
          title: this.$i18n.t('tableHeader.unclePosition')
        },
        {
          title: this.$i18n.t('tableHeader.blockN')
        },
        {
          title: this.$i18n.t('common.hash')
        },
        {
          title: this.$i18n.t('block.pHash')
        },
        {
          title: this.$i18n.t('block.miner')
        },
        {
          title: this.$i18n.t('common.timestmp')
        },
        {
          title: this.$i18n.t('block.pHash')
        },
        {
          title: this.$i18n.t('block.sha')
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
          title: this.$i18n.t('tableHeader.uncleHeight'),
          detail: this.uncle.getNumber()
        },
        {
          title: this.$i18n.t('tableHeader.unclePosition'),
          detail: this.uncle.getPosition()
        },
        {
          title: this.$i18n.t('tableHeader.blockN'),
          detail: this.uncle.getBlockHeight(),
          link: '/block/' + this.uncle.getBlockHeight()
        },
        {
          title: this.$i18n.t('common.hash'),
          detail: this.uncle.getHash(),
          copy: true
        },
        {
          title: this.$i18n.t('block.pHash'),
          detail: this.uncle.getParentHash()
        },
        {
          title: this.$i18n.t('block.miner'),
          detail: this.uncle.getMiner().toString(),
          link: '/address/' + this.uncle.getMiner().toString(),
          copy: true
        },
        {
          title: this.$i18n.t('common.timestmp'),
          detail: this.formatTime
        },
        {
          title: this.$i18n.t('block.pHash'),
          detail: this.uncle.getParentHash().toString()
        },
        {
          title: this.$i18n.t('block.sha'),
          detail: this.uncle.getSha3Uncles().toString()
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

  get formatTime(): string {
    return new Date(this.timestamp).toString()
  }

  /**
   * Returns breadcrumbs entry for this particular view.
   * Required for AppBreadCrumbs
   *
   * @return {Array} - Breadcrumb entry. See description.
   */
  get crumbs() {
    return [
      {
        text: this.$i18n.t('title.uncles'),
        disabled: false,
        link: '/uncles'
      },
      {
        text: this.$i18n.t('common.uncle') + ': ' + this.uncleRef,
        disabled: true
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
