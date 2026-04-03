import { Controller, Get, Post, Req, UseGuards, Body } from '@nestjs/common'
import { LocalGuard } from './guards/local.guard'
import { Request } from 'express'
import { JwtGuard } from './guards/jwt.guard'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { AuthPayloadDto } from './dto/auth-payload.dto'
import {
  AuthResponseDto,
  LoginResponseDto,
  UserResponseDto,
} from './dto/auth-response.dto'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'User Registration',
    description: 'Registers a new user and returns a JWT access token.',
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered.',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 409, description: 'Username already exists.' })
  async register(@Body() authPayload: AuthPayloadDto) {
    return this.authService.register(authPayload)
  }

  @Post('login')
  @UseGuards(LocalGuard)
  @ApiOperation({
    summary: 'User Login',
    description: 'Authenticates a user and returns a JWT access token.',
  })
  @ApiBody({ type: AuthPayloadDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully authenticated.',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  login(@Req() req: Request) {
    return req.user
  }

  @Get('status')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Auth Status',
    description:
      'Checks if the user is authenticated and returns the user information.',
  })
  @ApiResponse({
    status: 200,
    description: 'User is authenticated.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Not authenticated.' })
  status(@Req() req: Request) {
    return req.user
  }
}
