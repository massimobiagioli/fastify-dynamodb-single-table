import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { Area, AreaCollection, AreaCreate } from '@models/area.model'

declare module 'fastify' {
  interface FastifyInstance {
    areaService: {
      getAll: () => Promise<AreaCollection>,
      get: (id: string) => Promise<Area | null>,
      put: (id: string, area: AreaCreate) => Promise<Area>,
    }
  }
}

async function areaServicePlugin(app: FastifyInstance): Promise<void> {

  function mapItemToArea(item: Record<string, any>): Area {
    return {
      id: item.areaId,
      name: item.name,
      manager: item.manager,
      location: item.location,
    }
  }

  async function getAll(): Promise<AreaCollection> {
    const result = await app.dynamoDbClient.Area.scan({
      filters: [
        {
          attr: '_et',
          eq: 'AREA'
        },
      ]
    })

    console.log(result)

    return result?.Items?.map(mapItemToArea) || []
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

    return mapItemToArea(Item)
  }

  async function put(id: string, area: AreaCreate): Promise<Area> {
    const result = await app.dynamoDbClient.Area.put({
      areaId: id,
      name: area.name,
      manager: area.manager,
      location: area.location,
    })

    if (result.$metadata.httpStatusCode !== 200) {
      throw new Error('Error creating area')
    }

    return {
      ...area,
      id,
    }
  }

  app.decorate('areaService', {
    getAll,
    get,
    put,
  })
}

export default fp(areaServicePlugin)