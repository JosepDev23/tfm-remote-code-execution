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
  ApiBearerAuth,
} from '@nestjs/swagger'
import { MaudeContainerService } from './maude-container.service'
import { JwtGuard } from 'src/auth/guards/jwt.guard'
import { Request } from 'express'
import {
  ExecuteCodeDto,
  ExecuteCodeResponseDto,
} from './dto/execute-code.dto'

@ApiTags('Maude Container')
@ApiBearerAuth()
@Controller('maude-container')
export class MaudeContainerController {
  constructor(private readonly maudeContainerService: MaudeContainerService) {}

  @Post('exec-code')
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: 'Execute Maude Code',
    description:
      'Executes the provided Maude code within a user-specific container.',
  })
  @ApiResponse({
    status: 201,
    description: 'Code executed successfully.',
    type: ExecuteCodeResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 408,
    description: 'Code execution exceeded the time limit.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  execMaudeCode(
    @Req() req: Request,
    @Body() maudeCode: ExecuteCodeDto,
  ): Promise<ExecuteCodeResponseDto> {
    return this.maudeContainerService.executeCode(req.user, maudeCode.code)
  }

  @Delete()
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: 'Remove User Container',
    description: 'Removes the active container associated with the user.',
  })
  @ApiResponse({ status: 200, description: 'User container removed.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User container not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  removeUserContainer(@Req() req: Request): Promise<void> {
    return this.maudeContainerService.removeUserContainer(req.user)
  }
}
