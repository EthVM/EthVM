import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  exports: [UsersService],
  providers: [
    UsersService
  ],
})
export class UserModule { }