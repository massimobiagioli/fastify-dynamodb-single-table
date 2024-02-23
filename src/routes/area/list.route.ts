import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { AreaCollection } from '@models/area.model'

const route: FastifyPluginAsyncTypebox = async function (app) {
  app.get<{ Reply: AreaCollection }>(
    '/',
    {
      schema: {
        tags: ['Area'],
        response: {
          200: AreaCollection,
          500: {
            type: 'null',
            description: 'Internal server error',
          },
        },
      },
    },
    async (req, reply) => {
      const result = await app.dynamoDbClient.Area.scan({
        filters: [
          {
            attr: 'type',
            eq: 'AREA'
          },
        ]
      })

      const areas = result?.Items?.map((item) => {
        return {
          id: item.areaId,
          name: item.areaName,
          manager: item.manager,
          location: item.location,
        }
      })

      reply.code(200).send(areas)
    },
  )
}

export default route