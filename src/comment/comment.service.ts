import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CommentService {
  constructor(private readonly database: DatabaseService) { }
 async create(createCommentDto: Prisma.CommentCreateInput) {
    return await this.database.comment.create({data:createCommentDto,include:{post:true,author:{select:{id:true,name:true,username:true}}}},)
  }

 async findAll(postId:number) {
    return await this.database.comment.findMany({where:{postId},include:{post:true,author:{select:{id:true,name:true,username:true}}}});
  }

 

 

  
}
