import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USERS_REPOSITORY } from './users.repository';
import type { CreateUserData, UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY) private readonly repository: UsersRepository,
  ) {}

  findAll() {
    return this.repository.findAll();
  }

  async findOne(id: string) {
    const user = await this.repository.findById(id);

    if (!user) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }

    return user;
  }

  create(data: CreateUserData) {
    return this.repository.create(data);
  }
}
