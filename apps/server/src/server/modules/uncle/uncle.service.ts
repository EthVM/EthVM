import { MongoUncleRepository, Uncle } from '@app/server/modules/uncle'
import { CacheRepository } from '@app/server/repositories'

export interface UnclesService {
  getUncles(limit: number, page: number): Promise<Uncle[]>
  getUncle(hash: string): Promise<Uncle | null>
}

export class UnclesServiceImpl implements UnclesService {
  constructor(private readonly uncleRepository: MongoUncleRepository, private readonly cacheRepository: CacheRepository) {}

  public getUncles(limit: number, page: number): Promise<Uncle[]> {
    return this.uncleRepository.getUncles(limit, page)
  }

  public getUncle(hash: string): Promise<Uncle | null> {
    return this.uncleRepository.getUncle(hash)
  }
}
