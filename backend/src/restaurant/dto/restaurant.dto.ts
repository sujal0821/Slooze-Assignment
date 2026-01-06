import { Field, InputType, ObjectType, Float } from '@nestjs/graphql';
import { Country } from '../../common/enums';

@ObjectType()
export class MenuItem {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => Float)
  price: number;
}

@ObjectType()
export class Restaurant {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => Country)
  country: Country;

  @Field(() => [MenuItem], { nullable: true })
  menuItems?: MenuItem[];
}

@InputType()
export class CreateRestaurantInput {
  @Field()
  name: string;

  @Field(() => Country)
  country: Country;
}

@InputType()
export class CreateMenuItemInput {
  @Field()
  restaurantId: string;

  @Field()
  name: string;

  @Field(() => Float)
  price: number;
}
