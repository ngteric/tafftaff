import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserResponse, UsersRepository } from './users.repository';

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  private readonly userSelect = {
    id: true,
    firstName: true,
    lastName: true,
    email: true,
    createdAt: true,
    updatedAt: true,
  };

  constructor(
    @Inject('PRISMA_SERVICE') private readonly prisma: PrismaService,
  ) {}

  findAll(): Promise<UserResponse[]> {
    return this.prisma.user.findMany({
      select: this.userSelect,
    });
  }

  findById(id: string): Promise<UserResponse | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: this.userSelect,
    });
  }
}
