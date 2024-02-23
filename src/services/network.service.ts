import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { Network, NetworkCollection, NetworkWithArea } from '@models/network.model'

declare module 'fastify' {
  interface FastifyInstance {
    networkService: {
      getByArea: (areaId: string) => Promise<NetworkCollection>,
      getById: (areaId: string, networkId: string) => Promise<Network | null>,
      getByAreaWithDetail: (areaId: string) => Promise<NetworkWithArea | null>,
    }
  }
}

async function networkServicePlugin(app: FastifyInstance): Promise<void> {

  async function getByArea(areaId: string): Promise<NetworkCollection> {
    const pk = `AREA#${areaId}`
    const sk = `${pk}#NETWORK`

    const result = await app.dynamoDbClient.Network.query(
      pk,
      {
        beginsWith: sk,
      }
    )

    return result?.Items?.map((item) => {
      return {
        id: item.networkId,
        type: item.networkType,
        connectionSpeed: item.connectionSpeed,
      }
    }) || []
  }

  async function getById(areaId: string, networkId: string): Promise<Network | null> {
    const pk = `AREA#${areaId}`
    const sk = `${pk}#NETWORK#${networkId}`
    const { Item} = await app.dynamoDbClient.Network.get({
      id: pk,
      sk: sk,
    })

    if (!Item) {
      return null
    }

    return {
      id: Item.networkId,
      type: Item.networkType,
      connectionSpeed: Item.connectionSpeed,
    }
  }

  async function getByAreaWithDetail(areaId: string): Promise<NetworkWithArea | null> {
    const pk = `AREA#${areaId}`

    const result = await app.dynamoDbClient.Network.query(
      pk,
      {
        beginsWith: pk,
      }
    )

    const areaItem = result?.Items?.at(0) as Record<string, any>

    if (!areaItem) {
      return null
    }

    const area = {
      id: areaItem.areaId,
      name: areaItem.areaName,
      manager: areaItem.manager,
      location: areaItem.location,
    }

    const networks = result?.Items
      ?.filter((item) => item.networkId)
      ?.map((item) => {
        return {
          id: item.networkId,
          type: item.networkType,
          connectionSpeed: item.connectionSpeed,
        }
      }) ?? []

    return {
      area,
      networks,
    }
  }

  app.decorate('networkService', {
    getByArea,
    getById,
    getByAreaWithDetail,
  })
}

export default fp(networkServicePlugin)