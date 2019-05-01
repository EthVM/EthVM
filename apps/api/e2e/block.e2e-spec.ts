import supertest from 'supertest'
import { Test } from '@nestjs/testing'
import { AppModule } from '../src/app.module'
import { INestApplication } from '@nestjs/common'

describe('e2e', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()
    app = await moduleFixture.createNestApplication().init()
  })

  it('get block', done => {
    return supertest(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `{
        block(
          hash: "88e96d4537bea4d9c05d12549907b32561d3bf31f45aae734cdc119f13406cb6"
        ) {
          hash
        }
      }
      `
      })
      .expect(200)
      .then(response => {
        expect(response.body.data.block.hash).toEqual('88e96d4537bea4d9c05d12549907b32561d3bf31f45aae734cdc119f13406cb6')
        done()
      })
  })

  it('get blocks', done => {
    return supertest(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `{
        blocks(limit:10,page:9){
          number
        }
      }
      `
      })
      .expect(200)
      .then(response => {
        expect(response.body.data.transactions).toHaveLength(10)
        done()
      })
  })

  afterAll(async () => {
    await app.close()
  })
})
