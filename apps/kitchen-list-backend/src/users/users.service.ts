import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './models/user.entity';
import { pbkdf2Sync, randomBytes } from 'node:crypto';
import { IUser } from './models/user.interface';
import { TgContactEntity } from './models/tg-contacts.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(TgContactEntity)
    private tgRepository: Repository<TgContactEntity>
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
      relations: {
        tgContacts: true,
      }
    });
  }

  async getUserByTgUid(uid: string) {
    return await this.usersRepository.findOneBy({tgUid: uid});
  }

  async getTgChat(id: number) {
    return this.tgRepository.findOneBy({id});
  }

  async getTgUid(userId: number) {
    const user = await this.getUserById(userId);
    if(!user) {
      throw new NotFoundException();
    }
    if(!user.tgUid) {
      user.tgUid = pbkdf2Sync(String(userId), randomBytes(4).toString('hex'), 100, 8, 'sha512').toString('hex');
      this.usersRepository.save(user);
    }
    return user.tgUid;
  }

  async addContact(userId: number, chatId: number, contactName: string) {
    const user = await this.getUserById(userId);
    const exist = user.tgContacts?.find(contact => contact.chatId === chatId);
    if(exist) return;
    const contact = this.tgRepository.create({chatId, name: contactName});
    await this.tgRepository.save(contact);
    if(!user.tgContacts?.length) {
      user.tgContacts = [contact];
    } else {
      user.tgContacts.push(contact);
    }
    await this.usersRepository.save(user);
  }

  async getUsersContacts(id: number) {
    const user = await this.getUserById(id);
    return user.tgContacts.map(({id, name}) => ({id, name}));
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
    await this.usersRepository.delete({id});
  }
}
