import { Field, InputType, ObjectType, Int, Float } from '@nestjs/graphql';
import { MenuItem, Restaurant } from '../../restaurant/dto/restaurant.dto';

@ObjectType()
export class OrderItem {
  @Field()
  id: string;

  @Field(() => MenuItem)
  menuItem: MenuItem;

  @Field(() => Int)
  quantity: number;
}

@ObjectType()
export class Order {
  @Field()
  id: string;

  @Field()
  status: string;

  @Field(() => Float)
  total: number;

  @Field(() => Restaurant)
  restaurant: Restaurant;

  @Field(() => [OrderItem])
  items: OrderItem[];

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  paymentMethod?: string;
}

@InputType()
export class OrderItemInput {
  @Field()
  menuItemId: string;

  @Field(() => Int)
  quantity: number;
}

@InputType()
export class CreateOrderInput {
  @Field()
  restaurantId: string;

  @Field()
  paymentMethod: string;

  @Field(() => [OrderItemInput])
  items: OrderItemInput[];
}
