import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateMenuItemInput,
  CreateRestaurantInput,
} from './dto/restaurant.dto';

@Injectable()
export class RestaurantService {
  constructor(private prisma: PrismaService) { }

  async createRestaurant(input: CreateRestaurantInput) {
    return this.prisma.restaurant.create({
      data: input,
    });
  }

  async createMenuItem(input: CreateMenuItemInput) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: input.restaurantId },
    });
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    return this.prisma.menuItem.create({
      data: {
        name: input.name,
        price: input.price,
        restaurant: { connect: { id: input.restaurantId } },
      },
    });
  }

  async findAll(user: any) {
    console.log(`findAll Restaurants - User: ${user.email}, Role: ${user.role}, Country: ${user.country}`);

    if (user.role === 'ADMIN') {
      return this.prisma.restaurant.findMany({
        include: { menuItems: true },
      });
    }

    if (!user.country) {
      console.warn('User has no country defined. Returning empty list.');
      return [];
    }

    return this.prisma.restaurant.findMany({
      where: { country: user.country },
      include: { menuItems: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.restaurant.findUnique({
      where: { id },
      include: { menuItems: true },
    });
  }
}
