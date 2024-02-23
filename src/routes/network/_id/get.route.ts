import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Network } from '@models/network.model'

const route: FastifyPluginAsyncTypebox = async function (app) {
  app.get<{ Params: { id: string}, Querystring: { areaId: string }, Reply: Network }>(
    '/',
    {
      schema: {
        tags: ['Network'],
        response: {
          200: Network,
          404: {
            type: 'null',
            description: 'Network not found',
          },
          500: {
            type: 'null',
            description: 'Internal server error',
          },
        },
      },
    },
    async (req, reply) => {
      const network = await app.networkService.getById(req.query.areaId, req.params.id)
      if (!network) {
        return reply.code(404).send()
      }
      reply.code(200).send(network)
    },
  )
}

export default route