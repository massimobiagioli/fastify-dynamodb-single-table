import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { NetworkCollection } from '@models/network.model'

const route: FastifyPluginAsyncTypebox = async function (app) {
  app.get<{ Querystring: { areaId: string}, Reply: NetworkCollection }>(
    '/',
    {
      schema: {
        tags: ['Network'],
        response: {
          200: NetworkCollection,
          500: {
            type: 'null',
            description: 'Internal server error',
          },
        },
      },
    },
    async (req, reply) => {
      const networks = await app.networkService.getByArea(req.query.areaId)
      reply.code(200).send(networks)
    },
  )
}

export default route