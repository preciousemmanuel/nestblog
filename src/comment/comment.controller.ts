import { Controller, Get, Post, Body, UseGuards, ValidationPipe, Request, Response, Param } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { responseObject } from 'src/utils/httpresponse/http.response';
import { HttpCodes } from 'src/utils/httpresponse/http.codes';

@Controller('comment')
@UseGuards(AuthGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @Post("post/:postId")
  async create(@Request() req, @Response() res, @Param("postId") postId, @Body(new ValidationPipe()) createCommentDto: CreateCommentDto) {
    const userId = req.user.userId;
    const createCommnt = {
      ...createCommentDto,
      author: {
        connect: { id: userId }
      },
      post: {
        connect: { id: +postId }
      },
    }
    const result = await this.commentService.create(createCommnt);

    return responseObject(res, HttpCodes.HTTP_CREATED, "success", "Success", result);
  }

  @Get("/post/:postId")
  async findAll(@Request() req, @Response() res, @Param("postId") postId,) {
    const result = await this.commentService.findAll(+postId);

    return responseObject(res, HttpCodes.HTTP_OK, "success", "Success", result);
  }




}
