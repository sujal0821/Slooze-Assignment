import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RestaurantService } from './restaurant.service';
import {
  Restaurant,
  MenuItem,
  CreateRestaurantInput,
  CreateMenuItemInput,
} from './dto/restaurant.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums';

@Resolver(() => Restaurant)
export class RestaurantResolver {
  constructor(private restaurantService: RestaurantService) { }

  @Mutation(() => Restaurant)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async createRestaurant(@Args('input') input: CreateRestaurantInput) {
    return this.restaurantService.createRestaurant(input);
  }

  @Mutation(() => MenuItem)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async createMenuItem(@Args('input') input: CreateMenuItemInput) {
    return this.restaurantService.createMenuItem(input);
  }

  @Query(() => [Restaurant])
  @UseGuards(GqlAuthGuard)
  async restaurants(@CurrentUser() user: any) {
    return this.restaurantService.findAll(user);
  }

  @Query(() => Restaurant)
  async restaurant(@Args('id') id: string) {
    return this.restaurantService.findOne(id);
  }
}
