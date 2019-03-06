import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConnectionOptions} from 'typeorm';
import {ConfigService} from "@app/shared/config.service";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: async (configService: ConfigService): Promise<ConnectionOptions> => ({
                type: 'mongodb',
                host: 'mongodb',
                port: 27017,
                synchronize: false,
                entities: ['src/**/**.entity{.ts,.js}'],
                logging: ['error']
            }),
            inject: [ConfigService]
        }),
    ],
})
export class OrmModule {
}
