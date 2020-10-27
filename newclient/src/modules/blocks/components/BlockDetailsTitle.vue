<template>
    <v-flex xs12>
        <v-layout v-if="!loading" row wrap align-center justify-start mt-1 mb-1>
            <!-- Previous Block -->
            <v-flex xs2 sm1>
                <v-layout v-if="prevBlock != ''" align-center justify-start>
                    <v-btn :to="prevBlock" flat color="secondary" class="black--text" icon @click="reload()"> <v-icon>fas fa-angle-left</v-icon> </v-btn>
                </v-layout>
            </v-flex>
            <!-- Title -->
            <v-flex xs8 sm10 pl-0 pr-0>
                <v-layout row wrap align-center justify-start>
                    <v-card-title class="title font-weight-bold pa-1">{{ title }}</v-card-title>
                    <v-dialog v-if="hasUncles" v-model="dialog" max-width="700">
                        <template #activator="{ on }">
                            <v-btn slot="activator" round outline color="primary" class="text-capitalize" small v-on="on">
                                {{ $tc('uncle.name', unclesPlural) }}
                                <v-icon right>fa fa-angle-right</v-icon>
                            </v-btn>
                        </template>
                        <v-card>
                            <v-card-title class="title font-weight-bold">{{ $tc('uncle.name', unclesPlural) }}:</v-card-title>
                            <v-divider class="lineGrey" />
                            <v-list>
                                <v-list-tile v-for="(uncle, index) in uncles" :key="index">
                                    <v-layout row justify-start align-center fill-height>
                                        <v-card-title class="info--text p-0">{{ $t('common.hash') }}:</v-card-title>
                                        <app-transform-hash :hash="uncle | toChecksum" :link="`/uncle/${uncle}`" />
                                    </v-layout>
                                </v-list-tile>
                            </v-list>
                        </v-card>
                    </v-dialog>
                </v-layout>
            </v-flex>
            <!-- Next Block -->
            <v-flex v-if="nextBlock != ''" xs2 sm1>
                <v-layout align-center justify-end>
                    <v-btn :to="nextBlock" flat color="secondary" class="black--text" icon> <v-icon>fas fa-angle-right</v-icon> </v-btn>
                </v-layout>
            </v-flex>
        </v-layout>
        <div v-else>
            <v-layout align-center justify-space-between>
                <v-flex v-if="!isSubscribed" xs5 sm4>
                    <v-progress-linear color="lineGrey" value="40" indeterminate height="20" class="ma-2" />
                </v-flex>
                <v-flex v-if="isSubscribed" xs8 sm11>
                    <v-card-title class="title font-weight-bold pl-4">{{ $t('message.not-mined') }}</v-card-title>
                </v-flex>
                <v-flex v-if="isSubscribed" xs2 sm1>
                    <v-progress-circular :size="20" color="secondary" indeterminate></v-progress-circular>
                </v-flex>
            </v-layout>
        </div>
    </v-flex>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import AppTransformHash from '@app/core/components/ui/AppTransformHash.vue'

@Component({
    components: {
        AppTransformHash
    }
})
export default class BlockDetailsTitle extends Vue {
    /*
  ===================================================================================
    Props
  ===================================================================================
  */

    @Prop(String) nextBlock!: string
    @Prop(String) prevBlock!: string
    @Prop(Array) uncles!: string[]
    @Prop({ type: Boolean, default: true }) loading!: boolean
    @Prop({ type: Boolean, default: false }) isSubscribed!: boolean

    /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

    dialog = false

    /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

    get title(): string {
        return this.$i18n.t('block.detail').toString()
    }

    get hasUncles(): boolean {
        return !!this.uncles && this.uncles.length > 0
    }

    get unclesPlural(): number {
        return this.hasUncles && this.uncles.length > 1 ? 2 : 1
    }
    /*
  ===================================================================================
  Methods
  ===================================================================================
  */
    /**
     * Emit's reload to parent
     */
    reload() {
        this.$emit('reload')
    }
}
</script>
