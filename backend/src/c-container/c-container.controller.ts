import {
  Body,
  Controller,
  Delete,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { CContainerService } from './c-container.service'
import CCode from 'src/models/c-code.model'
import { JwtGuard } from 'src/auth/guards/jwt.guard'
import { Request } from 'express'

@ApiTags('CContainer Controller')
@Controller('c-container')
export class CContainerController {
  constructor(private readonly cContainerService: CContainerService) {}

  @Post('exec-code')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Exec C Code' })
  @ApiBody({ description: 'C code' })
  @ApiResponse({ status: 201, description: 'Code Executed', type: String })
  execCCode(
    @Req() req: Request,
    @Body() cCode: CCode,
  ): Promise<{ stdout: string; stderr: string }> {
    return this.cContainerService.executeCode(req.user, cCode.code)
  }

  @Delete()
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Remove User Container' })
  @ApiResponse({ status: 200, description: 'User Container Removed' })
  removeUserContainer(@Req() req: Request): Promise<void> {
    return this.cContainerService.removeUserContainer(req.user)
  }
}
