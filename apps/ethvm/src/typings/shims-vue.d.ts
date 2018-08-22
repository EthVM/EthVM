import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    $socket: any
    $eventHub: any
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    $socket?: any
    $eventHub?: any
  }
}
