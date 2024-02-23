import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { NetworkWithArea } from '@models/network.model'

const route: FastifyPluginAsyncTypebox = async function (app) {
  app.get<{ Querystring: { areaId: string}, Reply: NetworkWithArea }>(
    '/withArea',
    {
      schema: {
        tags: ['Network'],
        response: {
          200: NetworkWithArea,
          404: {
            type: 'null',
            description: 'Area not found',
          },
          500: {
            type: 'null',
            description: 'Internal server error',
          },
        },
      },
    },
    async (req, reply) => {
      const networksWithArea = await app.networkService.getByAreaWithDetail(req.query.areaId)
      if (!networksWithArea) {
        return reply.code(404).send()
      }
      reply.code(200).send(networksWithArea)
    },
  )
}

export default route