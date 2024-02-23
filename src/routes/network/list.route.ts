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
      const pk = `AREA#${req.query.areaId}`
      const sk = `${pk}#NETWORK`

      const result = await app.dynamoDbClient.Network.query(
        pk,
        {
          beginsWith: sk,
        }
      )

      const networks = result?.Items?.map((item) => {
        return {
          id: item.networkId,
          type: item.networkType,
          connectionSpeed: item.connectionSpeed,
        }
      })

      reply.code(200).send(networks)
    },
  )
}

export default route