import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import { LocalGuard } from './guards/local.guard'
import { Request } from 'express'
import { JwtGuard } from './guards/jwt.guard'
import { ApiOperation } from '@nestjs/swagger'

@Controller('auth')
export class AuthController {
  constructor() {}

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
