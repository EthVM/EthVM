import { Test } from '@nestjs/testing'
import { ProcessingMetadataService } from './processing-metadata.service'
import { ProcessingMetadataResolvers } from './processing-metadata.resolvers'
import { ProcessingMetadataEntity } from '../../orm/entities/processing-metadata.entity'
import { ProcessingMetadataDto } from './processing-metadata.dto'
import { PubSub } from 'graphql-subscriptions'

const mockService = {
  async findProcessingMetaDataById(id) {},
}

describe('ProcessingMetadataResolvers', () => {

  let processingMetadataService: ProcessingMetadataService
  let processingMetadataResolvers: ProcessingMetadataResolvers

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProcessingMetadataResolvers,
        {
          provide: ProcessingMetadataService,
          useValue: mockService
        },
        {
          provide: 'PUB_SUB',
          useValue: new PubSub(),
        }
      ],
    }).compile()
    processingMetadataService = module.get<ProcessingMetadataService>(ProcessingMetadataService)
    processingMetadataResolvers = module.get<ProcessingMetadataResolvers>(ProcessingMetadataResolvers)
  })

  const id = 'syncing'
  const result = { id }

  describe('processingMetadataById', () => {
    it('should return an instance of ProcessingMetadataDto matching the id provided', async () => {

      jest.spyOn(processingMetadataService, 'findProcessingMetaDataById')
        .mockImplementation(() => new Promise(resolve => {
          resolve(new ProcessingMetadataEntity(result))
        }))

      expect(await processingMetadataResolvers.processingMetadataById(id)).toEqual(new ProcessingMetadataDto(result))
    })
  })
})
