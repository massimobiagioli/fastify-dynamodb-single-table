import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Device } from '@models/device.model'

const route: FastifyPluginAsyncTypebox = async function (app) {
  app.get<{ Params: { id: string}, Querystring: { areaId: string, networkId: string }, Reply: Device }>(
    '/',
    {
      schema: {
        tags: ['Device'],
        response: {
          200: Device,
          404: {
            type: 'null',
            description: 'Device not found',
          },
          500: {
            type: 'null',
            description: 'Internal server error',
          },
        },
      },
    },
    async (req, reply) => {
      const device = await app.deviceService.getById(req.query.areaId, req.query.networkId, req.params.id)
      if (!device) {
        return reply.code(404).send()
      }
      reply.code(200).send(device)
    },
  )
}

export default route