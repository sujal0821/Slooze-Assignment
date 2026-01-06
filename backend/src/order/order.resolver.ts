import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order, CreateOrderInput } from './dto/order.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums';
import { User } from '../auth/dto/auth.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private orderService: OrderService) { }

  @Mutation(() => Order)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async placeOrder(
    @CurrentUser() user: User,
    @Args('input') input: CreateOrderInput,
  ) {
    return this.orderService.createOrder(user.id, input);
  }

  @Mutation(() => Order)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async payOrder(@Args('id') id: string) {
    return this.orderService.payOrder(id);
  }

  @Mutation(() => Order)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async cancelOrder(@Args('id') id: string) {
    return this.orderService.cancelOrder(id);
  }

  @Mutation(() => Order)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updatePaymentMethod(@Args('id') id: string) {
    // Placeholder implementation as logic wasn't specified, but permissions were.
    // Assuming simple return for now or service call if I add it.
    return this.orderService.updatePaymentMethod(id);
  }

  @Query(() => [Order])
  @UseGuards(GqlAuthGuard)
  async orders(@CurrentUser() user: User) {
    return this.orderService.findAll(user);
  }
}
