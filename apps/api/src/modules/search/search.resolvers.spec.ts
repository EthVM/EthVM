import { Test } from '@nestjs/testing'
import { SearchService } from './search.service'
import { SearchResolvers } from './search.resolvers'
import { SearchDto } from './search.dto'

const mockService = {
  async search(query) {},
}

describe('SearchResolvers', () => {

  let searchService: SearchService
  let searchResolvers: SearchResolvers

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SearchResolvers,
        {
          provide: SearchService,
          useValue: mockService
        }
      ],
    }).compile()
    searchService = module.get<SearchService>(SearchService)
    searchResolvers = module.get<SearchResolvers>(SearchResolvers)
  })

  const hash = '0x0000000000000000000000000000000000000000000000000000000000000000'
  const number = 0
  const result = {
    type: 'Block',
    block: {
      id: number,
      header: {
        hash,
        number
      }
    }
  }

  describe('search', () => {
    it('should return an instance of SearchDto matching the query or null', async () => {

      jest.spyOn(searchService, 'search')
        .mockImplementation(() => new Promise(resolve => {
          resolve(new SearchDto(result))
        }))

      expect(await searchResolvers.search(hash)).toEqual(new SearchDto(result))
    })
  })
})
