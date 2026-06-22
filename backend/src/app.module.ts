import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JobOffersModule } from './job-offers/job-offers.module';

@Module({
  imports: [UsersModule, AuthModule, JobOffersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
