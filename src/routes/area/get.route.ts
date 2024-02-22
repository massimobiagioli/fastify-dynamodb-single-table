import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Area } from '@models/area.model'

const route: FastifyPluginAsyncTypebox = async function (app) {
  app.get<{ Params: { areaId: string},  Reply: Area }>(
    '/:areaId',
    {
      schema: {
        tags: ['Area'],
        response: {
          200: Area,
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
      const areaId = `AREA#${req.params.areaId}`
      const { Item} = await app.dynamoDbClient.Area.get({
        id: areaId,
        sk: areaId,
      })

      if (!Item) {
        return reply.code(404).send()
      }

      reply.code(200).send({
        id: Item.areaId,
        name: Item.name,
        manager: Item.manager,
        location: Item.location,
      })
    },
  )
}

export default route