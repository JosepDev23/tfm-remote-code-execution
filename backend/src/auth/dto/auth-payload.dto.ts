import { ApiProperty } from '@nestjs/swagger'

export class AuthPayloadDto {
  @ApiProperty({
    example: 'puig d mont',
    description: 'Unique username for the user',
  })
  username: string

  @ApiProperty({
    example: 'StrongPassword123!',
    description: 'Secure password for the user',
  })
  password: string
}
