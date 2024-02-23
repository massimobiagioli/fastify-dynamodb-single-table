import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { DeviceCollection } from '@models/device.model'

const route: FastifyPluginAsyncTypebox = async function (app) {
  app.get<{ Querystring: { areaId: string, networkId: string }, Reply: DeviceCollection }>(
    '/',
    {
      schema: {
        tags: ['Device'],
        response: {
          200: DeviceCollection,
          500: {
            type: 'null',
            description: 'Internal server error',
          },
        },
      },
    },
    async (req, reply) => {
      const devices = await app.deviceService.getByAreaAndNetwork(req.query.areaId, req.query.networkId)
      reply.code(200).send(devices)
    },
  )
}

export default route