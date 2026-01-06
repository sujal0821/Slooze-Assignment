import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantResolver } from './restaurant.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [RestaurantService, RestaurantResolver],
})
export class RestaurantModule {}
