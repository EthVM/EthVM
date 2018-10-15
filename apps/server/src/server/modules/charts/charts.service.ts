import { ChartsRepository } from '@app/server/modules/charts'

export interface ChartService {
  // Empty for now
}

export class ChartsServiceImpl implements ChartService {
  constructor(private readonly chartsRepository: ChartsRepository) {}
}
