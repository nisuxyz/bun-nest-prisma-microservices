import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { Post as PostModel, Prisma } from 'generated/prisma';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post()
  async createPost(
    @Body() postData: Prisma.PostCreateInput,
  ): Promise<PostModel> {
    const { title, content, author } = postData;
    return this.appService.createPost({
      title,
      content,
      author
    },);
  }

  @Get()
  async getPosts(): Promise<PostModel[]> {
    return await this.appService.posts();
  }

  @Get('filter')
  async getFilteredPosts(
    @Query('take') take?: number,
    @Query('skip') skip?: number,
    @Query('searchString') searchString?: string,
    @Query('orderBy') orderBy?: 'asc' | 'desc',
  ): Promise<PostModel[]> {
    const where = searchString
      ? {
        OR: [
          { title: { contains: searchString } },
          { content: { contains: searchString } },
        ],
      }
      : {};
    return await this.appService.posts({
      skip: Number(skip) || undefined,
      take: Number(take) || undefined,
      where,
      orderBy: {
        updatedAt: orderBy
      }
    })
  }

  @Get(':id')
  async getPostById(@Param('id') id: string): Promise<PostModel | null> {
    return await this.appService.post({ id: Number(id) });
  }

  @Put(':id/content')
  async updatePostContent(
    @Param('id') id: string,
    @Body() contentData: { content: string }
  ): Promise<PostModel> {
    return this.appService.updatePost({
      where: { id: Number(id) },
      data: contentData,
    });
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string): Promise<PostModel> {
    return this.appService.deletePost({ id: Number(id) });
  }
}
