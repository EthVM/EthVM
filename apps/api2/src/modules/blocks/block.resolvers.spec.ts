import { Test } from '@nestjs/testing';
import { BlockEntity } from './block.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BlockService } from './block.service'
import { BlockResolvers } from './block.resolvers'


describe('BlockResolver', () => {

  let blockService: BlockService;

beforeEach(async () => {
  const module = await Test.createTestingModule({
    // imports: [TypeOrmModule.forFeature([BlockEntity])],
    providers: [BlockService, BlockResolvers],
    exports: [BlockService]
  }).compile();

  blockService = module.get<BlockService>(BlockService);
});

describe('findAll', () => {
  it('should return an array of blocks', async () => {

  });
});


})

