import Vue from 'vue'
import { BehaviorSubject } from 'rxjs'
import { ICoinData } from '@app/plugins/CoinData'

declare module 'vue/types/vue' {
    interface Vue {
        $CD: ICoinData
    }
}
