<template>
    <p class="black--text mb-0 caption">
        {{ timeSince }}
    </p>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import moment, { unitOfTime } from 'moment'

@Component
export default class AppTimeAgo extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */
    @Prop(Date) timestamp!: Date

    items: unitOfTime.Diff[] = ['years', 'months', 'days', 'hours', 'minutes', 'seconds']
    timeformat: string[] = ['timeformat.year', 'timeformat.month', 'timeformat.day', 'timeformat.hour', 'timeformat.minute', 'timeformat.second']

    /**
     * Converts a date to an age string
     * @returns : Value as formatted string,
     */
    get timeSince(): string {
        try {
            for (let n = 0; n < this.items.length; n++) {
                const diff = moment().diff(this.timestamp, this.items[n])
                if (diff > 0) {
                    return this.$tc(this.timeformat[n], diff)
                }
            }
            return ''
        } catch (e) {
            return ''
        }
    }
}
</script>
