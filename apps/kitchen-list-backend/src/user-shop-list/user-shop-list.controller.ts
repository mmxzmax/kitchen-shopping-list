import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserShopListService } from './user-shop-list.service';
import { GetUser } from '../decorators/get-user.decorator';
import { LoggedInGuard } from '../guards/logged-in.guard';
import { CreateUserShopListDto } from './models/create-user-shop-list.dto';
import { EditUserShopListDto } from './models/edit-user-shop-list.dto';

@UseGuards(LoggedInGuard)
@Controller('user-shop-list')
export class UserShopListController {
  constructor(private listService: UserShopListService) {}

  @Get()
  list(@GetUser('id') userId: number) {
    return this.listService.list(userId);
  }

  @Get(':id')
  listById(
    @GetUser('id') userId: number,
    @Param(':id', ParseIntPipe) id: number
  ) {
    return this.listService.listById(userId, id);
  }

  @Post()
  createList(
    @GetUser('id') userId: number,
    @Body() data: CreateUserShopListDto
  ) {
    return this.listService.createList(userId, data);
  }

  @Post(':id')
  editList(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: EditUserShopListDto
  ) {
    return this.listService.editList(id, userId, data);
  }

  @Delete(':id')
  deleteList(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.listService.deleteList(id, userId);
  }
}
