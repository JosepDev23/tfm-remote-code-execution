import { Injectable, OnModuleDestroy } from '@nestjs/common'
import Docker from 'dockerode'
import { PassThrough } from 'stream'
import { v4 as uuidv4 } from 'uuid'
import {
  CodeExecutionTimeoutException,
  ContainerLimitExceededException,
  UserContainerExistsException,
  UserContainerNotFoundException,
} from './js-container.errors'
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy'
import { Cron, CronExpression } from '@nestjs/schedule'

@Injectable()
export class JsContainerService implements OnModuleDestroy {
  private docker = new Docker()
  private userContainers = new Map<string, string>()

  private readonly MAX_CONTAINERS = 10

  private lastActivity = new Map<string, number>() // userId -> timestamp
  private readonly INACTIVITY_LIMIT = 10 * 60 * 1000 // 10 minutes

  constructor(private readonly jwtStrategy: JwtStrategy) {}

  private getUserId(user: Express.User | string | any): string {
    if (!user) {
      throw new Error('User is undefined or null')
    }
    if (typeof user === 'string') {
      return user
    }
    const validatedUser = this.jwtStrategy.validate(user)
    if (!validatedUser) {
      throw new Error('User validation failed')
    }
    const id = validatedUser._id || validatedUser.id
    if (!id) {
      throw new Error('User ID not found in payload')
    }
    return typeof id === 'object' ? id.toString() : id
  }

  async createUserContainer(user: Express.User): Promise<string> {
    const userId = this.getUserId(user)

    const existing = this.userContainers.get(userId)
    if (existing) {
      throw new UserContainerExistsException(existing)
    }

    if (this.userContainers.size >= this.MAX_CONTAINERS) {
      throw new ContainerLimitExceededException(this.MAX_CONTAINERS)
    }

    const containerName: string = `js-${uuidv4()}`

    const container: Docker.Container = await this.docker.createContainer({
      Image: 'js-container',
      name: containerName,
      Tty: true,
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      HostConfig: {
        Memory: 512 * 1024 * 1024, // 512 MB
        MemorySwap: 512 * 1024 * 1024, // Limit swap to memory limit (no swap storage usage)
        NanoCpus: 1000000000, // 1 CPU core
      },
    })

    await container.start()

    this.userContainers.set(userId, container.id)

    return container.id
  }

  async executeCode(
    user: Express.User,
    code: string,
  ): Promise<{ stdout: string; stderr: string }> {
    // First, validate user and update last activity
    const userId = this.getUserId(user)
    this.lastActivity.set(userId, Date.now())

    // Then, do everything else
    let containerId = this.userContainers.get(userId)
    if (!containerId) containerId = await this.createUserContainer(user)

    const container = this.docker.getContainer(containerId)

    const tarStream = await this.buildTar(code)
    await container.putArchive(tarStream, { path: '/workspace' })

    const exec = await container.exec({
      AttachStdout: true,
      AttachStderr: true,
      Cmd: ['node', 'tmp.js'],
      WorkingDir: '/workspace',
    })

    const execRes = await exec.start({})
    const muxStream = (
      'output' in execRes ? execRes.output : execRes
    ) as NodeJS.ReadableStream

    const stdoutStream = new PassThrough()
    const stderrStream = new PassThrough()
    this.docker.modem.demuxStream(muxStream, stdoutStream, stderrStream)

    return new Promise((resolve, reject) => {
      const chunksOut: Buffer[] = []
      const chunksErr: Buffer[] = []
      const timer = setTimeout(
        () => reject(new CodeExecutionTimeoutException(5)),
        5_000,
      )

      stdoutStream.on('data', (c) => chunksOut.push(c))
      stderrStream.on('data', (c) => chunksErr.push(c))

      muxStream.on('end', () => {
        clearTimeout(timer)
        resolve({
          stdout: Buffer.concat(chunksOut).toString(),
          stderr: Buffer.concat(chunksErr).toString(),
        })
      })

      muxStream.on('error', (err) => {
        clearTimeout(timer)
        reject(err)
      })
    })
  }

  async removeUserContainer(user: Express.User | string): Promise<void> {
    const userId = this.getUserId(user)

    const containerId = this.userContainers.get(userId)

    if (!containerId) {
      throw new UserContainerNotFoundException(userId)
    }

    this.userContainers.delete(userId)
    this.lastActivity.delete(userId)

    const container: Docker.Container = this.docker.getContainer(containerId)

    try {
      await container.stop()
    } catch (e: any) {
      if (e.statusCode !== 304 && e.statusCode !== 404) {
        console.warn(
          `Warning stopping container ${containerId}: ${e.message || e}`,
        )
      }
    }

    try {
      await container.remove()
    } catch (e: any) {
      if (e.statusCode !== 404 && e.statusCode !== 409) {
        throw e
      }
      console.warn(
        `Warning removing container ${containerId}: ${e.message || e}`,
      )
    }
  }

  async onModuleDestroy() {
    for (const userId of this.userContainers.keys()) {
      try {
        await this.removeUserContainer(userId)
      } catch (e) {
        console.error(
          `Error removing container for user ${userId} on module destroy:`,
          e,
        )
      }
    }
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  private async cleanupInactiveContainers() {
    const now = Date.now()

    for (const [userId, last] of this.lastActivity.entries()) {
      if (now - last > this.INACTIVITY_LIMIT) {
        const containerId = this.userContainers.get(userId)
        if (!containerId) continue

        this.userContainers.delete(userId)
        this.lastActivity.delete(userId)

        try {
          const container = this.docker.getContainer(containerId)

          try {
            await container.stop()
          } catch (e: any) {
            if (e.statusCode !== 304 && e.statusCode !== 404) {
              console.warn(
                `Warning stopping container ${containerId}: ${e.message || e}`,
              )
            }
          }

          try {
            await container.remove()
          } catch (e: any) {
            if (e.statusCode !== 404 && e.statusCode !== 409) {
              throw e
            }
            console.warn(
              `Warning removing container ${containerId}: ${e.message || e}`,
            )
          }

          console.log(
            `🧹 JS container for user ${userId} removed due to inactivity`,
          )
        } catch (e) {
          console.error('Error cleaning container', containerId, e)
        }
      }
    }
  }

  private async buildTar(code: string): Promise<NodeJS.ReadableStream> {
    const tar = require('tar-stream').pack()
    tar.entry({ name: 'tmp.js' }, code)
    tar.finalize()
    return tar
  }
}
