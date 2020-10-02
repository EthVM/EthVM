<template>
    <div :class="[chipColor, 'chip']">{{ chipText }}</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { EnumAdrChips } from '@app/core/components/props'
@Component
export default class AppAdrChip extends Vue {
    /*
  ===================================================================================
    Props
  ===================================================================================
  */

    @Prop({ type: String }) chip!: EnumAdrChips

    /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

    get chipText(): string {
        switch (this.chip) {
            case EnumAdrChips.miner:
                return this.$t('miner.name').toString()
            case EnumAdrChips.creator:
                return this.$t('contract.creator').toString()
            case EnumAdrChips.contract: {
                return this.$tc('contract.name', 1).toString()
            }
            default: {
                return ''
            }
        }
    }
    get chipColor(): string {
        switch (this.chip) {
            case EnumAdrChips.miner:
                return 'miner-chip'
            case EnumAdrChips.creator:
                return 'creator-chip'
            case EnumAdrChips.contract: {
                return 'contract-chip'
            }
            default: {
                return ''
            }
        }
    }
}
</script>

<style scoped lang="css">
.chip {
    border-radius: 14px;
    font-size: 85%;
    color: white;
    padding: 2px 10px;
}

.miner-chip {
    background-color: #40ce9c;
}

.creator-chip {
    background-color: #b3d4fc;
}

.contract-chip {
    background-color: #fed18e;
}
</style>
