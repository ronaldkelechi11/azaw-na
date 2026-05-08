import { Controller, Post, Body, Get, Param, Delete, UseGuards, Req, UseInterceptors, UploadedFiles, Query } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { RepliesService } from './replies.service';
import { CreateReplyDto } from './dto/create-reply.dto';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiOperation } from '@nestjs/swagger';

@ApiTags('replies')
@Controller('replies')
export class RepliesController {
  constructor(private readonly repliesService: RepliesService) {}

  @Post()
  @ApiOperation({ summary: 'Send an anonymous reply' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images', 4)) // Allow up to 4 images
  async create(
    @Body() createReplyDto: CreateReplyDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req,
  ) {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    return this.repliesService.create(createReplyDto, files, ip);
  }

  @Get()
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get replies for the authenticated user' })
  findAll(@Req() req, @Query('skip') skip?: number, @Query('limit') limit?: number) {
    return this.repliesService.findAllForUser(req.user.uid, skip ? +skip : 0, limit ? +limit : 20);
  }

  @Delete(':id')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a specific reply' })
  remove(@Req() req, @Param('id') id: string) {
    return this.repliesService.remove(req.user.uid, id);
  }
}
