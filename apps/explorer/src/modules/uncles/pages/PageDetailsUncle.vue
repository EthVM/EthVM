<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="crumbs" />
    <v-layout row wrap justify-start class="mb-4">
      <v-flex xs12>
        <app-list-details :items="uncleDetails" :hide-more="hideMore" :details-type="listType" :loading="loading">
          <app-list-title slot="details-title" :list-type="listType" />
        </app-list-details>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import AppListDetails from '@app/core/components/ui/AppListDetails.vue'
import AppListTitle from '@app/core/components/ui/AppListTitle.vue'
import { Events } from 'ethvm-common'
import { eth } from '@app/core/helper'
import { Uncle } from '@app/core/models'
import { Vue, Component, Prop, Mixins } from 'vue-property-decorator'
import { Detail } from '@app/core/components/props'

@Component({
  components: {
    AppBreadCrumbs,
    AppListDetails,
    AppListTitle
  }
})
export default class PageDetailsUncle extends Vue {
  @Prop({ type: String }) uncleRef!: string

  loading = true
  error = false
  listType = 'uncle'
  hideMore = true

  uncle = null
  details = []
  timestamp = ''

  // Lifecycle
  created() {
    const ref = this.uncleRef

    // 1. Check that current uncle ref is valid one
    if (!eth.isValidHash(ref)) {
      this.error = true
      this.loading = false
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

  //Methods:
  fetchUncle() {
    this.$api
      .getUncle(this.uncleRef)
      .then(uncle => this.setUncleInfo(uncle))
      .catch(err => (this.error = true))
  }

  setUncleInfo(uncle: Uncle) {
    this.uncle = uncle
    this.timestamp = this.uncle.getTimestamp().toString()
    this.setDetails(this.uncle)
    this.loading = false
  }

  setDetails(uncle: Uncle) {
    this.details = [
      {
        title: this.$i18n.t('tableHeader.blockHeight'),
        detail: uncle.getNumber()
      },
      {
        title: this.$i18n.t('tableHeader.unclePosition'),
        detail: uncle.getPosition()
      },
      {
        title: this.$i18n.t('tableHeader.blockN'),
        detail: uncle.getBlockHeight(),
        link: '/block/' + uncle.getBlockHeight()
      },
      {
        title: this.$i18n.t('common.hash'),
        detail: uncle.getHash(),
        copy: true
      },
      {
        title: this.$i18n.t('block.pHash'),
        detail: uncle.getParentHash()
      },
      {
        title: this.$i18n.t('block.miner'),
        detail: uncle.getMiner().toString(),
        link: '/address/' + uncle.getMiner().toString(),
        copy: true
      },
      {
        title: this.$i18n.t('common.timestmp'),
        detail: this.formatTime
      },
      {
        title: this.$i18n.t('block.pHash'),
        detail: uncle.getParentHash().toString()
      },
      {
        title: this.$i18n.t('block.sha'),
        detail: uncle.getSha3Uncles().toString()
      },
      {
        title: this.$i18n.t('gas.limit'),
        detail: uncle.getGasLimit().toNumber()
      },
      {
        title: this.$i18n.t('gas.used'),
        detail: uncle.getGasUsed().toNumber()
      }
    ]
  }

  // Computed
  get uncleDetails(): Detail[] {
    return this.details
  }

  get formatTime(): string {
    return new Date(this.timestamp).toString()
  }

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
}
</script>
