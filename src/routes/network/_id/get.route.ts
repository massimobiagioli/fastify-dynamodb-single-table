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
      const pk = `AREA#${req.query.areaId}`
      const sk = `${pk}#NETWORK#${req.params.id}`
      const { Item} = await app.dynamoDbClient.Network.get({
        id: pk,
        sk: sk,
      })

      if (!Item) {
        return reply.code(404).send()
      }

      reply.code(200).send({
        id: Item.networkId,
        type: Item.networkType,
        connectionSpeed: Item.connectionSpeed,
      })
    },
  )
}

export default route