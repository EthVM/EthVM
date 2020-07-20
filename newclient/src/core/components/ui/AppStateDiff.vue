<template>
    <v-dialog :hide-overlay="false" v-model="showDialog">
        <v-btn slot="activator" class="ml-3 mr-1 more-btn" color="white" fab depressed>
            <p class="info--text title pb-2">...</p>
        </v-btn>
    </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { State } from '@app/core/components/props'

@Component
export default class AppStateDiff extends Vue {
    /*
  ===================================================================================
    Props
  ===================================================================================
  */

    @Prop(Object) state!: State

    /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

    showDialog = false

    /*
  ===================================================================================
   Watch
  ===================================================================================
  */
    @Watch('showState')
    onShowState(newVal: boolean): void {
        this.showDialog = newVal
    }

    /*
  ===================================================================================
    Lifecycle
  ===================================================================================
  */

    mounted() {
        console.log('mounted', this.state)
    }
}
</script>
