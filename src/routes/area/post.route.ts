import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Area } from '@models/area.model'

const route: FastifyPluginAsyncTypebox = async function (app) {
  app.post<{ Body: Area, Reply: Area }>(
    '/',
    {
      schema: {
        tags: ['Area'],
        body: Area,
        response: {
          200: Area,
          500: {
            type: 'null',
            description: 'Internal server error',
          },
        },
      },
    },
    async (req, reply) => {
      const area = await app.areaService.put(req.body)
      reply.code(200).send(area)
    },
  )
}

export default route