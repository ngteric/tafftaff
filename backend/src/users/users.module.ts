import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaUsersRepository } from './prisma-users.repository';
import { UsersController } from './users.controller';
import { USERS_REPOSITORY } from './users.repository';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'PRISMA_SERVICE',
      useClass: PrismaService,
    },
    {
      provide: USERS_REPOSITORY,
      useClass: PrismaUsersRepository,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
