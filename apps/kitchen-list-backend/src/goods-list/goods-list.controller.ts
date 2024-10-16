import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { GoodsListService } from './goods-list.service';
import { CreateGoodDto } from './models/create-good.dto';
import { AdminGuard } from '../guards/admin.guard';
import { LoggedInGuard } from '../guards/logged-in.guard';

@UseGuards(LoggedInGuard)
@Controller('goods-list')
export class GoodsListController {
  constructor(private readonly goodsListService: GoodsListService) {}

  @Get()
  list() {
    return this.goodsListService.list();
  }

  @Get('find')
  lettersList(@Query('category', ParseIntPipe) categoryId: number) {
    return this.goodsListService.getLetters(categoryId);
  }

  @Get(':letter')
  listByLetter(@Param('letter') letter, @Query('category', ParseIntPipe) categoryId: number ) {
    return this.goodsListService.getListByLetter(letter, categoryId);
  }

  @Get(':id')
  itemById(@Param('id', ParseIntPipe) id: number) {
    return this.goodsListService.getItemById(id);
  }

  @Post()
  create(@Body() data: CreateGoodDto) {
    return this.goodsListService.createGood(data);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  deleteItem(@Param('id', ParseIntPipe) id: number) {
    return this.goodsListService.deleteItem(id);
  }

  @UseGuards(AdminGuard)
  @Post(':id')
  editItem(@Param('id', ParseIntPipe) id: number, @Body() data: CreateGoodDto) {
    return this.goodsListService.editItem(id, data);
  }
}
