import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from './strategies/local.strategy'
import { JwtStrategy } from './strategies/jwt.strategy'
import { userProviders } from './providers/user.providers'
import { DatabaseModule } from 'src/database/database.module'
import { UserService } from './user.service'

@Module({
  imports: [
    JwtModule.register({
      secret: 'needtochangethistorandomsecret',
      signOptions: { expiresIn: '1h' },
    }),
    PassportModule,
    DatabaseModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    LocalStrategy,
    JwtStrategy,
    ...userProviders,
  ],
  exports: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
