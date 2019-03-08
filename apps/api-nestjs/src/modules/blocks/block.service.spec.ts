import { Test, TestingModule } from '@nestjs/testing'
import { BlockEntity } from '@app/modules/blocks/block.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { BlockService } from '@app/modules/blocks/block.service'
import { BlockResolvers } from '@app/modules/blocks/block.resolvers'

describe('BlockService', () => {
  let app: TestingModule
  const block1 = new BlockEntity({
    hash: '1f1aed8e3694a067496c248e61879cda99b0709a1dfbacd0b693750df06b326e'
  })

  const block2 = new BlockEntity({
    hash: '1f1aed8e3694a067496c248e61879cda99b0709a1dfbacd0b693750df06b326e'
  })

  const mockBlocks = [block1, block2]

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [BlockService, BlockResolvers],
      exports: [BlockService]
    })
      .overrideProvider(getRepositoryToken(BlockEntity))
      .useValue({ find: () => mockBlocks, findOne: () => block1 })
      .compile()
  })

  describe('getBlock', () => {
    it('should return a block', async () => {
      let blockService = app.get<BlockService>(BlockService)
      let b = await blockService.getBlock('1f1aed8e3694a067496c248e61879cda99b0709a1dfbacd0b693750df06b326e')
      expect(b.hash).toEqual('1f1aed8e3694a067496c248e61879cda99b0709a1dfbacd0b693750df06b326e')
    })
  })

  describe('getBlocks', () => {
    it('should return array of blocks', async () => {
      let blockService = app.get<BlockService>(BlockService)
      let b = await blockService.getBlocks(0, 9)
      expect(b).toHaveLength(2)
    })
  })
})
