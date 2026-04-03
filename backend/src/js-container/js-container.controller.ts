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
import { JsContainerService } from './js-container.service'
import JsCode from 'src/models/js-code.model'
import { JwtGuard } from 'src/auth/guards/jwt.guard'
import { Request } from 'express'

@ApiTags('JsContainer Controller')
@Controller('js-container')
export class JsContainerController {
  constructor(private readonly jsContainerService: JsContainerService) {}

  @Post('exec-code')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Exec JavaScript Code' })
  @ApiBody({ description: 'JavaScript code' })
  @ApiResponse({ status: 201, description: 'Code Executed', type: String })
  execJsCode(
    @Req() req: Request,
    @Body() jsCode: JsCode,
  ): Promise<{ stdout: string; stderr: string }> {
    return this.jsContainerService.executeCode(req.user, jsCode.code)
  }

  @Delete()
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Remove User Container' })
  @ApiResponse({ status: 200, description: 'User Container Removed' })
  removeUserContainer(@Req() req: Request): Promise<void> {
    return this.jsContainerService.removeUserContainer(req.user)
  }
}
