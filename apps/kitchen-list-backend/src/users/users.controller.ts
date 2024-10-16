import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { LoggedInGuard } from '../guards/logged-in.guard';
import { EditUserDto } from './models/edit-user.dto';
import { AdminGuard } from '../guards/admin.guard';
import { GetUser } from '../decorators/get-user.decorator';

@UseGuards(LoggedInGuard)
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseGuards(AdminGuard)
  @Get('list')
  list() {
    return this.userService.getUsersList();
  }

  @Get()
  async getUser(@GetUser('id') curentUser: number) {
    const { id, firstName, lastName, email, role, tgContacts } =
      await this.userService.getUserById(curentUser);
    return {
      id,
      firstName,
      lastName,
      email,
      role,
      tgContacts: tgContacts.map(({ id, name }) => ({ id, name })),
    };
  }

  @Get('tg-invite-link')
  async tgLink(@GetUser('id') curentUser: number) {
    const uid = await this.userService.getTgUid(curentUser);
    return { link: `https://t.me/kkitchenshoppinglist_bot?start=${uid}` };
  }

  @Get('tg-contacts')
  tgContacts(@GetUser('id') curentUser: number) {
    return this.userService.getUsersContacts(curentUser);
  }

  @Post(':id')
  async editUser(
    @Param('id', ParseIntPipe) userId: number,
    @Body() data: EditUserDto
  ) {
    await this.userService.editUserData(userId, data);
    return { ok: true };
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  deleteUser(
    @GetUser('id') curentUser: number,
    @Param('id', ParseIntPipe) userId: number
  ) {
    if (curentUser !== userId) {
      return this.userService.deleteUser(userId);
    }
    throw new ForbiddenException();
  }
}
