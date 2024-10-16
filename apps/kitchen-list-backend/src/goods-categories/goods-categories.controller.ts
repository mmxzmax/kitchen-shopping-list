import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { GoodsCategoriesService } from './goods-categories.service';
import { LoggedInGuard } from '../guards/logged-in.guard';
import { AdminGuard } from '../guards/admin.guard';
import { CreateGoodsCategoryDto } from './models/create-goods-category.dto';

@UseGuards(LoggedInGuard)
@Controller('goods-categories')
export class GoodsCategoriesController {
    constructor(private readonly categoryService: GoodsCategoriesService) {}

    @Get()
    list() {
        return this.categoryService.list();
    }

    @Get(':id') 
    categoryById(@Param('id', ParseIntPipe) id: number) {
        return this.categoryService.categoryById(id);
    }

    @Post() 
    createCategory(@Body() data: CreateGoodsCategoryDto) {
        return this.categoryService.createCategory(data);
    }

    @UseGuards(AdminGuard)
    @Post(':id') 
    editCategory(@Param('id', ParseIntPipe) id: number, @Body() data: CreateGoodsCategoryDto) {
        return this.categoryService.editCategory(id, data)
    }

    @UseGuards(AdminGuard)
    @Delete(':id') 
    deleteCategory(@Param('id', ParseIntPipe) id: number) {
        return this.categoryService.deleteCategory(id);
    }
}
