import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards, HttpCode } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GroupsService } from './groups.service';
import { CreateGroupDto, JoinGroupDto } from './groups.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('groups')
@UseGuards(AuthGuard('jwt'))
export class GroupsController {
  constructor(private groupsService: GroupsService) {}

  @Get()
  findMyGroups(@CurrentUser() user: { id: number }) {
    return this.groupsService.findMyGroups(user.id);
  }

  @Post()
  create(@Body() dto: CreateGroupDto, @CurrentUser() user: { id: number }) {
    return this.groupsService.create(dto, user.id);
  }

  @Post('join')
  @HttpCode(200)
  join(@Body() dto: JoinGroupDto, @CurrentUser() user: { id: number }) {
    return this.groupsService.join(dto, user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: { id: number }) {
    return this.groupsService.findOne(id, user.id);
  }

  @Get(':id/leaderboard')
  leaderboard(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: { id: number }) {
    return this.groupsService.getLeaderboard(id, user.id);
  }
}
