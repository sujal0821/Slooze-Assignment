import {
  Field,
  InputType,
  ObjectType,
} from '@nestjs/graphql';
import { Role, Country } from '../../common/enums';

@ObjectType()
export class User {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field(() => String, { nullable: true })
  name?: string | null;

  @Field(() => Role)
  role: Role;

  @Field(() => Country, { nullable: true })
  country?: Country | null;
}

@ObjectType()
export class AuthPayload {
  @Field()
  accessToken: string;

  @Field(() => User)
  user: User;
}

@InputType()
export class LoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class RegisterInput {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => Role, { defaultValue: Role.MEMBER })
  role: Role;

  @Field(() => Country, { defaultValue: Country.INDIA })
  country: Country;
}
