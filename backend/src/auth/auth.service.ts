import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import type { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private readonly passwordSaltRounds = 10;

  constructor(private readonly usersService: UsersService) {}

  async register(registerDto: RegisterDto) {
    const password = await bcrypt.hash(
      registerDto.password,
      this.passwordSaltRounds,
    );

    return this.usersService.create({
      email: registerDto.email,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      password,
    });
  }
}
