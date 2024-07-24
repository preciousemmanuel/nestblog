import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginationDto } from './dto/pagination.dto';
import { Post, Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class PostService {
  constructor(private readonly database: DatabaseService) { }

  async create(createPostDto: Prisma.PostCreateInput): Promise<Post | Error> {
    try {
      console.log("fidisds", createPostDto)
      const post = await this.database.post.create({ data: createPostDto });
      console.log(post);

      return post;
    } catch (error) {
      console.log("eeor", error)
      throw new BadRequestException();
    }
  }

  async findAll(paginationDto:PaginationDto): Promise<any> {
    const {limit=10,page=1}=paginationDto;
    const skip = (+page - 1) * limit;
    const take = +limit;

    const posts= await this.database.post.findMany({ skip,take,orderBy:{createdAt:"desc"}, include: { author: { select: { name: true, username: true, id: true } } } });
  
    const totalPosts = await this.database.post.count();
    const totalPages = Math.ceil(totalPosts / limit);

    return {
      posts,
      meta: {
        totalPosts,
        totalPages,
        currentPage: page,
      },
    };
  }

  async findPostByUserId(userId: number,paginationDto:PaginationDto): Promise<any> {
    const {limit=10,page=1}=paginationDto;
    const skip = (+page - 1) * limit;
    const take = +limit;
    const posts= await this.database.post.findMany({ skip,take,orderBy:{createdAt:"desc"}, where: { userId }, include: { author: { select: { name: true, username: true, id: true } } } });
  
    const totalPosts = await this.database.post.count();
    const totalPages = Math.ceil(totalPosts / limit);

    return {
      posts,
      meta: {
        totalPosts,
        totalPages,
        currentPage: page,
      },
    };
  }

  async findOne(id: number): Promise<Post | null> {

    const data = await this.database.post.findFirst({ where: { id }, include: {comment:true, author: { select: { name: true, username: true, id: true } } } });
    if (!data) {
      return null;
    }
    return data;
  }

  async update(id: number, userId: number, updatePostDto: UpdatePostDto): Promise<Post | Error> {
    try {
      const post = await this.findOne(id);
      if (!post) {
        throw new NotFoundException("Post not found");
      }
      if (post.userId != userId) {
        throw new BadRequestException("You can only update your post");
      }
      console.log("s", updatePostDto)
      const result = await this.database.post.update({ where: { id }, data: updatePostDto });
      console.log(result)
      return result;
    } catch (error) {
      throw new InternalServerErrorException();
    }

  }

  async remove(id: number, userId: number) {
    const post = await this.findOne(id);
    if (!post) {
      throw new NotFoundException("Post not found");
    }
    if (post.userId != userId) {
      throw new BadRequestException("You can only delete your post");
    }
    return await this.database.post.delete({ where: { id } });
  }
}
