import { Module } from '@nestjs/common'
import { WinstonModule } from 'nest-winston'
import winston from 'winston'

@Module({
  imports: [
    WinstonModule.forRoot({
      level: 'info',
      format: winston.format.combine(
        // winston.format.colorize(),
        winston.format.simple()
      ),
      transports: [new winston.transports.Console()]
    })
  ]
})
export class LoggerModule {}
