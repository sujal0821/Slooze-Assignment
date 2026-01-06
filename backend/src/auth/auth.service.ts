import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginInput, RegisterInput, AuthPayload } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) { }

  async register(input: RegisterInput): Promise<AuthPayload> {
    const existing = await this.prisma.user.findUnique({
      where: { email: input.email },
    });
    if (existing) throw new ConflictException('Email already in use');

    const hashedPassword = await bcrypt.hash(input.password, 10);
    const user = await this.prisma.user.create({
      data: {
        ...input,
        password: hashedPassword,
      },
    });

    const token = this.jwtService.sign({ userId: user.id, role: user.role });
    return { accessToken: token, user: user as unknown as any };
  }

  async login(input: LoginInput): Promise<AuthPayload> {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(input.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ userId: user.id, role: user.role });
    return { accessToken: token, user: user as unknown as any };
  }
}
