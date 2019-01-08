import ethUnits from 'ethereumjs-units'
import Bn from 'bignumber.js'
import { common } from '@app/helpers'
import { Block } from '@app/models'
import { Component, Vue } from 'vue-property-decorator'
import { Detail } from '@app/components/props'

@Component
export class BlockDetailsMixin extends Vue {
  details = []
  moreDetails = []
  timestmp = ''

  //Methods:
  setDetails(block: Block) {
    this.timestmp = block.getTimestamp().toString()

    this.details = [
      {
        title: this.$i18n.t('block.height'),
        detail: block.getNumber()
      },
      {
        title: this.$i18n.t('common.hash'),
        detail: block.getHash(),
        copy: true
      },
      {
        title: this.$i18n.t('block.miner'),
        detail: block.getMiner(),
        link: '/address/' + block.getMiner(),
        copy: true
      },
      {
        title: this.$i18n.t('common.timestmp'),
        detail: this.formatTime
      },
      {
        title: this.$i18n.t('block.reward'),
        detail: common.WeiValue(block.getMinerReward()).toEthFormated() + '  ' + this.$i18n.t('common.eth')
      },
      {
        title: this.$i18n.t('block.uncle') + ' ' + this.$i18n.t('block.uncReward'),
        detail: common.WeiValue(block.getUncleReward()).toEthFormated() + ' ' + this.$i18n.t('common.eth')
      },
      {
        title: this.$i18n.t('block.pHash'),
        detail: block.getParentHash(),
        link: '/block/' + block.getParentHash()
      }
    ]

    if (block.getIsUncle()) {
      const item = {
        title: this.$i18n.t('title.position'),
        detail: block.getPosition()
      }
      this.details.push(item)
    } else {
      const item = {
        title: this.$i18n.t('title.tx'),
        detail: block.getTransactionCount()
      }
      this.details.push(item)
    }
  }

  setMore(block: Block) {
    this.moreDetails = [
      {
        title: this.$i18n.t('block.diff'),
        detail: block.getDifficulty()
      },
      {
        title: this.$i18n.t('block.totalDiff'),
        detail: block.getTotalDifficulty()
      },
      {
        title: this.$i18n.t('block.nonce'),
        detail: block.getNonce()
      },
      {
        title: this.$i18n.t('block.root'),
        detail: block.getStateRoot().toString()
      },
      {
        title: this.$i18n.t('block.data'),
        detail: block.getExtraData().toString()
      }
    ]

    if (!block.getIsUncle()) {
      const newItems = [
        {
          title: this.$i18n.t('block.fees'),
          detail: ethUnits.convert(new Bn(block.getTxFees()), 'wei', 'eth') + ' ' + this.$i18n.t('common.eth')
        },
        {
          title: this.$i18n.t('gas.limit'),
          detail: block.getGasLimit()
        },
        {
          title: this.$i18n.t('gas.used'),
          detail: block.getGasUsed()
        },
        {
          title: this.$i18n.t('block.logs'),
          detail: block.getLogsBloom().toString()
        },
        {
          title: this.$i18n.t('block.txRoot'),
          detail: block.getTransactionsRoot().toString()
        },
        {
          title: this.$i18n.t('block.recRoot'),
          detail: block.getReceiptsRoot().toString()
        },
        {
          title: this.$i18n.t('block.uncle') + ' ' + this.$i18n.t('block.sha'),
          detail: block.getSha3Uncles()
        }
      ]
      newItems.forEach(i => {
        this.moreDetails.push(i)
      })
    }
  }

  // Computed

  get blockDetails(): Detail[] {
    return this.details
  }

  get blockMoreDetails(): Detail[] {
    return this.moreDetails
  }

  get formatTime(): string {
    return new Date(this.timestmp).toString()
  }
}
