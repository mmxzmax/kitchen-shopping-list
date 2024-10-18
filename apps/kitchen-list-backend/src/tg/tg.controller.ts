import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { TgService } from './tg.service';
import { UsersService } from '../users/users.service';
import { GetUser } from '../decorators/get-user.decorator';
import { UserShopListService } from '../user-shop-list/user-shop-list.service';
import { LoggedInGuard } from '../guards/logged-in.guard';

@UseGuards(LoggedInGuard)
@Controller('tg')
export class TgController {
  constructor(
    private tgService: TgService,
  ) {}

  @Get(':contactId/:listId')
  async sendListToContact(
    @GetUser('id') userId: number,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Param('listId', ParseIntPipe) listId: number
  ) {
    await this.tgService.createListMessage(userId, contactId, listId);
  }
}
