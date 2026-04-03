import { HttpException, HttpStatus } from '@nestjs/common'

export class UserContainerExistsException extends HttpException {
  constructor(containerId: string) {
    super(
      `User already has an active container (${containerId}).`,
      HttpStatus.CONFLICT,
    )
  }
}

export class ContainerLimitExceededException extends HttpException {
  constructor(limit: number) {
    super(
      `Active container limit of ${limit} has been reached.`,
      HttpStatus.TOO_MANY_REQUESTS,
    )
  }
}

export class UserContainerNotFoundException extends HttpException {
  constructor(userId: string) {
    super(
      `User «${userId}» does not have an active container.`,
      HttpStatus.NOT_FOUND,
    )
  }
}

export class CodeExecutionTimeoutException extends HttpException {
  constructor(timeoutSeconds?: number) {
    super(
      timeoutSeconds
        ? `Code execution exceeded the time limit of ${timeoutSeconds} seconds.`
        : `Code execution exceeded the time limit.`,
      HttpStatus.REQUEST_TIMEOUT,
    )
  }
}
