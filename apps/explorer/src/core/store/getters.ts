import { State } from '@app/core/store/state'

export default {
  // Syncing
  syncing: (state: State): boolean => state.syncing
}
