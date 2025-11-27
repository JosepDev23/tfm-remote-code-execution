import { Controller, Get, Post, Req, UseGuards, Body } from '@nestjs/common'
import { LocalGuard } from './guards/local.guard'
import { Request } from 'express'
import { JwtGuard } from './guards/jwt.guard'
import { ApiOperation } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { AuthPayloadDto } from './dto/auth-payload.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'User Registration' })
  async register(@Body() authPayload: AuthPayloadDto) {
    return this.authService.register(authPayload)
  }

  @Post('login')
  @UseGuards(LocalGuard)
  @ApiOperation({ summary: 'User Login' })
  login(@Req() req: Request) {
    return req.user
  }

  @Get('status')
  @UseGuards(JwtGuard)
  status(@Req() req: Request) {
    return req.user
  }
}
