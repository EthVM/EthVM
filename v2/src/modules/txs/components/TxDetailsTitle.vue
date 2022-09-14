<template>
    <div class="pb-1 pt-1">
        <v-row align="center" justify="start" class="pa-1">
            <v-card-title align-center justify-start class="title font-weight-bold pl-4"> Transaction Details </v-card-title>
            <app-tooltip :text="props.status" :icon-color="statusColor" :spin="statusSpin" :icon-type="statusIcon" />
        </v-row>
        <v-divider class="lineGrey mt-1 mb-1" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppTooltip from '@/core/components/AppTooltip.vue'
import { TitleStatus } from '@/modules/txs/models/ErrorMessagesForTx'

const props = defineProps({
    status: {
        type: String,
        default: TitleStatus.success
    }
})

/*
===================================================================================
  Computed Values
===================================================================================
*/

const statusIcon = computed<string>(() => {
    switch (props.status) {
        case TitleStatus.success:
            return 'check_circle'
        case TitleStatus.failed:
            return 'highlight_off'
        case TitleStatus.pending:
            return 'sync'
        default:
            return 'sync'
    }
})

const statusColor = computed<string>(() => {
    switch (props.status) {
        case TitleStatus.success:
            return 'green'
        case TitleStatus.failed:
            return 'red'
        case TitleStatus.pending:
            return 'orange'
        default:
            return 'info'
    }
})

const statusSpin = computed<boolean>(() => {
    return props.status === TitleStatus.pending
})
</script>

<style scoped lang="css">
.chip {
    height: 28px;
    border-radius: 14px;
    border: solid 1px;
    padding: 5px 10px;
}

.status-success {
    border-color: #40ce9c;
    color: #40ce9c;
}
.status-fail {
    border-color: #fe1377;
    color: #fe1377;
}

.status-replaced {
    border-color: #8391a8;
    color: #8391a8;
}
.status-pending {
    border-color: #eea66b;
    color: #eea66b;
}
</style>
