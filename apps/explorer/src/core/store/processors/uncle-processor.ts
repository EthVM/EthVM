import { Uncle } from '@app/core/models'

const dedup = (uncle: Uncle, uncles: Uncle[]): Uncle[] => {
  for (let i = 0; i < uncles.length; i++) {
    if (uncle.getId() === uncles[i].getId()) {
      uncles.splice(i, 1)
    }
  }
  return uncles
}

export const processUncles = (uncle: Uncle, uncles: Uncle[]): Uncle[] => {
  uncles = dedup(uncle, uncles)
  uncles.push(uncle)
  return uncles
}
