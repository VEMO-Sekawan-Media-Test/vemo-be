import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
      },
    });
  }

  async getApprovers() {
    return this.prisma.user.findMany({
      where: {
        role: {
          in: ['ADMIN', 'APPROVER'],
        },
      },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
      },
    });
  }
}
