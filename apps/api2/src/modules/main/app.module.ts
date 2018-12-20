import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from './../config'
import { GraphQLModule } from '../graphql/graphql.module'
import { BlockModule } from '../blocks/block.module'



// import {createConnection} from "typeorm";
// import {Blocks} from "../blocks/block.entity";
// createConnection().then(async connection => {
//     const block = connection.getRepository(Blocks)
//     const loadedPosts = await block.find({hash:'88e96d4537bea4d9c05d12549907b32561d3bf31f45aae734cdc119f13406cb6'});
//     console.log("Loaded posts from the database: ", loadedPosts);

// }).catch(error => console.log("Error: ", error));

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    GraphQLModule,
    ConfigModule,
    BlockModule
  ],
  providers: [
    AppService
  ],
})
export class AppModule { }
