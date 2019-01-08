import { Tx } from '@app/models'
import { Component, Vue } from 'vue-property-decorator'

@Component
export class TxDetailsMixin extends Vue {
  data() {
    return {
      details: Array,
      moreDetails: Array,
      timestmp: ''
    }
  }

  //Methods:
  getStringStatus(isBool: boolean) {
    if (isBool) {
      return 'Successful'
    }
    this.statusColor = 'warning--text'
    return 'Failed'
  }

  getTxCost(price, used) {
    return price * used
  }

  getTo(tx: Tx) {
    if (tx.getContractAddress()) {
      return {
        title: this.$i18n.t('tx.to') + ' ' + this.$i18n.t('tx.contract'),
        detail: tx.getContractAddress(),
        copy: true,
        link: '/address/' + tx.getContractAddress()
      }
    } else {
      return {
        title: this.$i18n.t('tx.to'),
        detail: tx.getTo(),
        copy: true,
        link: '/address/' + tx.getTo()
      }
    }
  }

  setDetails(tx: Tx) {
    this.timestamp = tx.getTimestamp()
    this.details = [
      {
        title: this.$i18n.t('common.hash'),
        detail: tx.getHash(),
        copy: true
      },
      {
        title: this.$i18n.t('common.timestmp'),
        detail: this.formatTime
      },
      {
        title: this.$i18n.t('tx.from'),
        detail: tx.getFrom(),
        copy: true,
        link: '/address/' + tx.getFrom()
      },
      {
        title: this.$i18n.t('tx.amount'),
        detail:
          tx
            .getValue()
            .toEthFormated()
            .toString() +
          ' ' +
          this.$i18n.t('common.eth')
      }
    ]
    this.details.push(this.getTo(tx))
  }

  setMore(tx: Tx) {
    this.moreDetails = [
      {
        title: this.$i18n.t('tableHeader.blockN'),
        detail: tx.getBlockNumber(),
        link: '/block/' + tx.getBlockHash()
      },
      {
        title: this.$i18n.t('gas.limit'),
        detail: tx.getGas()
      },
      {
        title: this.$i18n.t('gas.used'),
        detail: tx.getGasUsed()
      },
      {
        title: this.$i18n.t('gas.price'),
        detail: tx.getGasPrice()
      },
      {
        title: this.$i18n.t('tx.cost'),
        detail: this.getTxCost(tx.getGasPrice(), tx.getGasUsed()) + ' ' + this.$i18n.t('common.eth')
      }
    ]
  }
  // Computed:
  get txDetails(): Array {
    return this.details
  }
  get txMoreDetails(): Array {
    console.log(this.moreDetails)
    return this.moreDetails
  }
  get formatTime(): Date {
    return new Date(this.timestamp).toString()
  }
}
