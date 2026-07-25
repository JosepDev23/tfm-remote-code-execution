import { ApiProperty } from '@nestjs/swagger'

export class ExecuteCodeDto {
  @ApiProperty({
    example:
      'fmod HELLO-WORLD is protecting STRING . op hello : -> String . eq hello = "Hello, World!" . endfm',
    description: 'The Maude code to be executed in the container.',
  })
  code: string
}

export class ExecuteCodeResponseDto {
  @ApiProperty({
    example: 'Hello, World!\n',
    description: 'Standard output from the code execution.',
  })
  stdout: string

  @ApiProperty({
    example: '',
    description: 'Standard error from the code execution.',
  })
  stderr: string
}
