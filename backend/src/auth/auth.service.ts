import { Injectable, ConflictException } from '@nestjs/common'
import { AuthPayloadDto } from './dto/auth-payload.dto'
import { JwtService } from '@nestjs/jwt'
import { UserService } from './user.service'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtservice: JwtService,
    private readonly userService: UserService,
  ) {}

  async register({ username, password }: AuthPayloadDto) {
    // Check if user already exists
    const existingUser = await this.userService.findByUsername(username)
    if (existingUser) {
      throw new ConflictException('Username already exists')
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await this.userService.create({
      username,
      password: hashedPassword,
    })

    // Return JWT token
    const { password: _, ...userWithoutPassword } = user.toObject()
    return {
      access_token: this.jwtservice.sign(userWithoutPassword),
      user: userWithoutPassword,
    }
  }

  async validateUser({ username, password }: AuthPayloadDto) {
    const user = await this.userService.findByUsername(username)
    if (!user) return null

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (isPasswordValid) {
      const { password: _, ...userWithoutPassword } = user.toObject()
      return this.jwtservice.sign(userWithoutPassword)
    }

    return null
  }
}
