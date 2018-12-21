import { Test, TestingModule } from '@nestjs/testing'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from './../config'

describe('AppController', () => {
  let app: TestingModule

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
      imports: [ConfigModule]
    }).compile()
  })

  describe('root', () => {
    it('should return "http://api.ethvm.lan"', () => {
      const appController = app.get<AppController>(AppController)
      expect(appController.root()).toBe('http://api.ethvm.lan')
    })
  })
})
