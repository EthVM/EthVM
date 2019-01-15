import { MongoUncleRepository } from '@app/server/modules/uncles'
import { Uncle } from 'ethvm-common'

export interface UnclesService {
  getUncles(limit: number, page: number): Promise<Uncle[]>
  getUncle(hash: string): Promise<Uncle | null>
}

export class UnclesServiceImpl implements UnclesService {
  constructor(private readonly uncleRepository: MongoUncleRepository) {}

  public getUncles(limit: number, page: number): Promise<Uncle[]> {
    return this.uncleRepository.getUncles(limit, page)
  }

  public getUncle(hash: string): Promise<Uncle | null> {
    return this.uncleRepository.getUncle(hash)
  }
}
