import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Area } from '@models/area.model'

const route: FastifyPluginAsyncTypebox = async function (app) {
  app.get<{ Params: { id: string},  Reply: Area }>(
    '/',
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
      const area = await app.areaService.get(req.params.id)
      if (!area) {
        return reply.code(404).send()
      }
      reply.code(200).send(area)
    },
  )
}

export default route