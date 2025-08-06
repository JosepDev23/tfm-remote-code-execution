import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { MaudeContainerService } from './maude-container.service'
import MaudeCode from 'src/models/maude-code.model'
import { JwtGuard } from 'src/auth/guards/jwt.guard'
import { Request } from 'express'

@ApiTags('MaudeContainer Controller')
@Controller('maude-container')
export class MaudeContainerController {
  constructor(private readonly maudeContainerService: MaudeContainerService) {}

  @Post()
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Create User Container' })
  @ApiBody({ description: 'User' })
  @ApiResponse({
    status: 201,
    description: 'User Container Created',
    type: String,
  })
  createUserContainer(@Req() req: Request): Promise<string> {
    return this.maudeContainerService.createUserContainer(req.user)
  }

  @Post('exec-code')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Exec Maude Code' })
  @ApiBody({ description: 'Maude code' })
  @ApiResponse({ status: 201, description: 'Code Executed', type: String })
  execMaudeCode(
    @Req() req: Request,
    @Body() maudeCode: MaudeCode,
  ): Promise<{ stdout: string; stderr: string }> {
    return this.maudeContainerService.executeCode(req.user, maudeCode.code)
  }

  @Delete()
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Remove User Container' })
  @ApiResponse({ status: 200, description: 'User Container Removed' })
  removeUserContainer(@Req() req: Request): Promise<void> {
    return this.maudeContainerService.removeUserContainer(req.user)
  }
}
