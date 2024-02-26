import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Network } from '@models/network.model'

const route: FastifyPluginAsyncTypebox = async function (app) {
  app.post<{ Body: Network, Reply: Network }>(
    '/',
    {
      schema: {
        tags: ['Network'],
        body: Network,
        response: {
          200: Network,
          500: {
            type: 'null',
            description: 'Internal server error',
          },
        },
      },
    },
    async (req, reply) => {
      const network = await app.networkService.put(req.body)
      reply.code(200).send(network)
    },
  )
}

export default route