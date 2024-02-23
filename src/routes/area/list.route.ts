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
      const areas = await app.areaService.getAll()
      reply.code(200).send(areas)
    },
  )
}

export default route