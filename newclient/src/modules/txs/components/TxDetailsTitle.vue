<template>
    <div class="pb-1 pt-1">
        <v-layout align-center justify-start class="pa-1">
            <v-card-title align-center justify-start class="title font-weight-bold pl-4">{{ title }}</v-card-title>
            <div :class="statusClass">
                <p class="caption text-lowercase">{{ $t(status) }}</p>
            </div>
        </v-layout>
        <v-divider class="lineGrey mt-1 mb-1" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import AppTransformHash from '@app/core/components/ui/AppTransformHash.vue'
import { TxStatus } from '@app/modules/txs/models/ErrorMessagesForTx'

@Component({
    components: {
        AppTransformHash
    }
})
export default class TxDetailsTitle extends Vue {
    /*
  ===================================================================================
    Props
  ===================================================================================
  */

    @Prop({ type: String, default: 'common.success' }) status!: TxStatus

    /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

    get title(): string {
        return this.$i18n.t('tx.detail').toString()
    }

    get statusClass(): string {
        switch (this.status) {
            case TxStatus.success:
                return 'chip success'
            case TxStatus.failed:
                return 'chip fail'
            case TxStatus.pending:
                return 'chip pending'
            default:
                return 'chip replaced'
        }
    }
}
</script>

<style scoped lang="css">
.chip {
    height: 28px;
    border-radius: 14px;
    border: solid 1px;
    padding: 5px 10px;
}

.success {
    border-color: #40ce9c;
    color: #40ce9c;
}
.fail {
    border-color: #fe1377;
    color: #fe1377;
}

.replaced {
    border-color: #8391a8;
    color: #8391a8;
}
.pending {
    border-color: #eea66b;
    color: #eea66b;
}
</style>
