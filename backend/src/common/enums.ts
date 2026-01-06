import { registerEnumType } from '@nestjs/graphql';

export enum Role {
    ADMIN = 'ADMIN',
    MANAGER = 'MANAGER',
    MEMBER = 'MEMBER',
}

export enum Country {
    INDIA = 'INDIA',
    USA = 'USA',
}

registerEnumType(Role, { name: 'Role' });
registerEnumType(Country, { name: 'Country' });
