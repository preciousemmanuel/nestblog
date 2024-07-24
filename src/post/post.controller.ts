import { Controller, Get, Post, Body, Patch, Param, Delete,ValidationPipe ,Request,Response,UseGuards, Put, Query} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Prisma } from '@prisma/client';
import { responseObject } from 'src/utils/httpresponse/http.response';
import { HttpCodes } from 'src/utils/httpresponse/http.codes';
import { PaginationDto } from './dto/pagination.dto';

@Controller('posts')
@UseGuards(AuthGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async create(@Request() req,@Response() res, @Body(new ValidationPipe()) createPostDto: CreatePostDto) {
   // console.log("reqee",req)
    const createPost={
      ...createPostDto,
      author:{
        connect:{id:req.user.userId}
      }
    }
    console.log(createPost)
     const post= await this.postService.create(createPost);

     return  responseObject(res,HttpCodes.HTTP_CREATED,"success","Success",post);
    
  }

  @Get()
  async findAll(@Request() req,@Response() res,@Query() paginationDto: PaginationDto) {
    const data=await this.postService.findAll(paginationDto);

    return  responseObject(res,HttpCodes.HTTP_OK,"success","Success",data);

  }

  @Get("mypost")
  async findMyPosts(@Request() req,@Response() res,@Query() paginationDto: PaginationDto) {
    const userId=req.user.userId;
    const data=await this.postService.findPostByUserId(userId,paginationDto);
   
    return  responseObject(res,HttpCodes.HTTP_OK,"success","Success",data);

  }

  @Get("user/:userId")
  async findUsersPosts(@Request() req,@Response() res,@Param('userId') userId: string,@Query() paginationDto: PaginationDto) {
    const data=await this.postService.findPostByUserId(+userId,paginationDto);

    return  responseObject(res,HttpCodes.HTTP_OK,"success","Success",data);

  }

  @Get(':id')
  async findOne(@Request() req,@Response() res,@Param('id') id: string) {
   const data =await this.postService.findOne(+id);
   if (!data) {
    return  responseObject(res,HttpCodes.HTTP_NOT_FOUND,"error","Post not found");
   }
    return  responseObject(res,HttpCodes.HTTP_OK,"success","Success",data);
  }

  @Put(':id')
 async update(@Request() req,@Response() res,@Param('id') id: string, @Body(new ValidationPipe()) updatePostDto: UpdatePostDto) {
    console.log(id)
    const userId=req.user.userId;
    const data=await this.postService.update(+id,userId, updatePostDto);

     return  responseObject(res,HttpCodes.HTTP_OK,"success","Successfully updated",data);
  }

  


  @Delete(':id')
 async remove(@Request() req,@Response() res, @Param('id') id: string) {
    const userId=req.user.userId;
   await  this.postService.remove(+id,userId);
    return  responseObject(res,HttpCodes.HTTP_OK,"success","Post Deleted Successfully");
  }
}
