import Vue from 'vue'
import { BehaviorSubject } from 'rxjs'

declare module 'vue/types/vue' {
    interface Vue {
        $matomo: any
    }
}
