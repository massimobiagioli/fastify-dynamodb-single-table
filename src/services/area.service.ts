import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { Area, AreaCollection } from '@models/area.model'

declare module 'fastify' {
  interface FastifyInstance {
    areaService: {
      getAll: () => Promise<AreaCollection>,
      get: (id: string) => Promise<Area | null>
    }
  }
}

async function areaServicePlugin(app: FastifyInstance): Promise<void> {

  async function getAll(): Promise<AreaCollection> {
    const result = await app.dynamoDbClient.Area.scan({
      filters: [
        {
          attr: 'type',
          eq: 'AREA'
        },
      ]
    })

    return result?.Items?.map((item) => {
      return {
        id: item.areaId,
        name: item.areaName,
        manager: item.manager,
        location: item.location,
      }
    }) || []
  }

  async function get(id: string): Promise<Area | null> {
    const pk = `AREA#${id}`
    const { Item} = await app.dynamoDbClient.Area.get({
      id: pk,
      sk: pk,
    })

    if (!Item) {
      return null
    }

    return {
      id: Item.areaId,
      name: Item.name,
      manager: Item.manager,
      location: Item.location,
    }
  }

  app.decorate('areaService', {
    getAll,
    get
  })
}

export default fp(areaServicePlugin)