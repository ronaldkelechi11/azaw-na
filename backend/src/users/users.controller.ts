import { Controller, Get, Body, Patch, Param, UseGuards, Req, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Req() req) {
    const user = await this.usersService.findOneByFirebaseUid(req.user.uid);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Patch('profile')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile' })
  async updateProfile(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.uid, updateUserDto);
  }

  @Get('u/:slug')
  @ApiOperation({ summary: 'Get public profile by slug' })
  @ApiResponse({ status: 200, description: 'Public profile returned successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getPublicProfile(@Param('slug') slug: string) {
    const user = await this.usersService.findOneBySlug(slug);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Only return safe public info
    return {
      username: user.username,
      avatar: user.avatar,
      bio: user.bio,
      socialLinks: user.socialLinks,
      replyCount: user.replyCount,
    };
  }
}
