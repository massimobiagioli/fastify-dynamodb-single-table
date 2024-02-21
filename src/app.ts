import 'module-alias/register'
import fastify, { FastifyInstance, FastifyServerOptions } from 'fastify'
import autoload from '@fastify/autoload'
import { join } from 'path'
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'

export default function createApp(
  opts?: FastifyServerOptions,
): FastifyInstance {
  const defaultOptions = {
    logger: true,
  }

  const app = fastify({ ...defaultOptions, ...opts })

  app.register(swagger, {
    swagger: {
      info: {
        title: 'Fastify DynamoDB Single Table',
        description: 'Fastify DynamoDB Single Table Design Demo App',
        version: '0.1.0',
      },
    },
  })

  app.register(swaggerUI)

  app.register(autoload, {
    dir: join(__dirname, 'features'),
  })

  app.register(autoload, {
    dir: join(__dirname, 'routes'),
    options: { prefix: '/api' },
  })

  return app
}
