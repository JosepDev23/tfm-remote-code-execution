import { Model } from 'mongoose'
import { Injectable, Inject } from '@nestjs/common'
import User from './interfaces/user.interface'
import { AuthPayloadDto } from './dto/auth-payload.dto'

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<User>,
  ) {}

  async create(AuthPayloadDto: AuthPayloadDto): Promise<User> {
    const createdUser = new this.userModel(AuthPayloadDto)
    return createdUser.save()
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec()
  }
}
