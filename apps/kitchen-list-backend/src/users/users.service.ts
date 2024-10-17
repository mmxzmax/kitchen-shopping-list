import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './models/user.entity';
import { pbkdf2Sync, randomBytes } from 'node:crypto';
import { IUser } from './models/user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>
  ) {}

  async getUsersList() {
    return await this.usersRepository.find({
      select: {
        id: true,
        email: true,
        role: true,
      }
    })
  }

  async getUserByLogin(email: string) {
    return await this.usersRepository.findOne({
      where: { email },
    });
  }
  async getUserById(id: number) {
    return await this.usersRepository.findOne({
      where: { id },
    });
  }

  async createNewUser(user: Partial<IUser>) {
    const salt = randomBytes(10).toString('hex');
    const password = pbkdf2Sync(
      user.password,
      salt,
      10000,
      64,
      'sha512'
    ).toString('hex');
    const { email, lastName, firstName } = user;
    const role = 'user';
    const userData = this.usersRepository.create({
      role,
      email,
      lastName,
      firstName,
      password,
      salt,
    });
    return await this.usersRepository.save(userData);
  }

  async editUserData(id: number, user: Partial<IUser>) {
    const existingUser = await this.getUserById(id);
    const userData = this.usersRepository.merge(existingUser, {
      ...existingUser,
      ...user,
    });
    return await this.usersRepository.save(userData);
  }

  async deleteUser(id: number) {
    const user = this.getUserById(id);
    await this.usersRepository.delete({id});
  }
}
