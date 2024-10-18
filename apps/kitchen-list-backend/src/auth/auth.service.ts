import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from '../users/models/login-user.dto';
import { RegisterUserDto } from '../users/models/register-user.dto';
import { IUser } from '../users/models/user.interface';
import { UsersService } from '../users/users.service';
import { pbkdf2Sync } from 'node:crypto';

@Injectable()
export class AuthService {

  constructor(private readonly userService: UsersService) {}

  async validateUser(user: LoginUserDto) {
    const foundUser = await this.userService.getUserByLogin(user.email);
    if (foundUser) {
      const hashedPassword = pbkdf2Sync(
        user.password,
        foundUser.salt,
        10000,
        64,
        'sha512',
      ).toString('hex');
      if (hashedPassword !== foundUser.password) {
        throw new UnauthorizedException();
      }
    }
    const { password: _password, salt: _salt, ...retUser } = foundUser;
    return retUser;
  }

  async registerUser(user: RegisterUserDto): Promise<Omit<IUser, 'password'>> {
    const existingUser = await this.userService.getUserByLogin(user.email);
    if (existingUser) {
      throw new BadRequestException('User remail must be unique');
    }
    if (user.password !== user.confirmationPassword) {
      throw new BadRequestException('Password and Confirmation Password must match');
    }
    const { confirmationPassword: _cp, ...newUser } = user;
    const {password: _p, salt: _s, ...createdUser } = await this.userService.createNewUser(newUser);
    return createdUser;
  }

  async findById(id: number): Promise<Omit<IUser, 'password'>> {
    const { password: _, ...user } = await this.userService.getUserById(id);
    if (!user) {
      throw new BadRequestException(`No user found with id ${id}`);
    }
    return user;
  }
}