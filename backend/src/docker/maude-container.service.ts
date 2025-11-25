import { Injectable, OnModuleDestroy } from '@nestjs/common'
import Docker from 'dockerode'
import { PassThrough } from 'stream'
import { v4 as uuidv4 } from 'uuid'
import {
  ContainerLimitExceededException,
  UserContainerExistsException,
  UserContainerNotFoundException,
} from './maude-container.errors'
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy'
import { Cron, CronExpression } from '@nestjs/schedule'

@Injectable()
export class MaudeContainerService implements OnModuleDestroy {
  private docker = new Docker()
  private userContainers = new Map<string, string>()

  private readonly MAX_CONTAINERS = 10

  private lastActivity = new Map<string, number>() // userId -> timestamp
  private readonly INACTIVITY_LIMIT = 10 * 60 * 1000 // 10 minutes

  constructor(private readonly jwtStrategy: JwtStrategy) {}

  async createUserContainer(user: Express.User): Promise<string> {
    const validatedUser = this.jwtStrategy.validate(user)

    const existing = this.userContainers.get(validatedUser.id)
    if (existing) {
      throw new UserContainerExistsException(existing)
    }

    if (this.userContainers.size >= this.MAX_CONTAINERS) {
      throw new ContainerLimitExceededException(this.MAX_CONTAINERS)
    }

    const containerName: string = `maude-${uuidv4()}`

    const container: Docker.Container = await this.docker.createContainer({
      Image: 'maude-container',
      name: containerName,
      Tty: true,
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
    })

    await container.start()

    this.userContainers.set(validatedUser.id, container.id)

    return container.id
  }

  async executeCode(
    user: Express.User,
    code: string,
  ): Promise<{ stdout: string; stderr: string }> {
    // First, validate user and update last activity
    const validatedUser = this.jwtStrategy.validate(user)
    this.lastActivity.set(validatedUser.id, Date.now())

    // Then, do everything else
    let containerId = this.userContainers.get(validatedUser.id)
    if (!containerId) containerId = await this.createUserContainer(user)

    const container = this.docker.getContainer(containerId)

    const tarStream = await this.buildTar(code)
    await container.putArchive(tarStream, { path: '/workspace' })

    const exec = await container.exec({
      AttachStdout: true,
      AttachStderr: true,
      Cmd: ['maude', 'tmp.maude'],
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
        () => reject(new Error('Execution timeout')),
        30_000,
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

  async removeUserContainer(user: Express.User): Promise<void> {
    const validatedUser = this.jwtStrategy.validate(user)

    const containerId: string = this.userContainers.get(validatedUser.id)

    if (!containerId) {
      throw new UserContainerNotFoundException(validatedUser.id)
    }

    const container: Docker.Container = this.docker.getContainer(containerId)

    await container.stop()
    await container.remove()

    this.userContainers.delete(validatedUser.id)

    this.lastActivity.delete(validatedUser.id)
  }

  async onModuleDestroy() {
    for (const userId of this.userContainers.keys()) {
      await this.removeUserContainer(userId)
    }
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  private async cleanupInactiveContainers() {
    const now = Date.now()

    for (const [userId, last] of this.lastActivity.entries()) {
      if (now - last > this.INACTIVITY_LIMIT) {
        const containerId = this.userContainers.get(userId)
        if (!containerId) continue

        try {
          const container = this.docker.getContainer(containerId)
          await container.stop()
          await container.remove()
        } catch (e) {
          console.error('Error cleaning container', containerId, e)
        }

        this.userContainers.delete(userId)
        this.lastActivity.delete(userId)

        console.log(
          `🧹 Contenedor del usuario ${userId} eliminado por inactividad`,
        )
      }
    }
  }

  private async buildTar(code: string): Promise<NodeJS.ReadableStream> {
    const tar = require('tar-stream').pack()
    tar.entry({ name: 'tmp.maude' }, code)
    tar.finalize()
    return tar
  }
}
