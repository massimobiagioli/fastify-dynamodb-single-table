import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { Device, DeviceCollection } from '@models/device.model'

declare module 'fastify' {
  interface FastifyInstance {
    deviceService: {
      getByAreaAndNetwork: (areaId: string, networkId: string) => Promise<DeviceCollection>,
      getById: (areaId: string, networkId: string, deviceId: string) => Promise<Device | null>,
    }
  }
}

async function deviceServicePlugin(app: FastifyInstance): Promise<void> {

  async function getByAreaAndNetwork(areaId: string, networkId: string): Promise<DeviceCollection> {
    const pk = `AREA#${areaId}#NETWORK#${networkId}`

    const result = await app.dynamoDbClient.Device.query(
      pk,
      {
        index: 'gsi1',
      },
    )

    return result?.Items?.map((item) => {
      return {
        id: item.deviceId,
        name: item.deviceName,
        type: item.deviceType,
        IPAddress: item.IPAddress,
      }
    }) || []
  }

  async function getById(areaId: string, networkId: string, deviceId: string): Promise<Device | null> {
    const pk = `AREA#${areaId}#NETWORK#${networkId}`
    const sk = `DEVICE#${deviceId}`

    const result = await app.dynamoDbClient.Device.query(
      pk,
      {
        index: 'gsi1',
        eq: sk,
      },
    )

    if (!result?.Items?.length) {
      return null
    }

    const item = result.Items[0]

    return {
      id: item.deviceId,
      name: item.deviceName,
      type: item.deviceType,
      IPAddress: item.IPAddress,
    }
  }

  app.decorate('deviceService', {
    getByAreaAndNetwork,
    getById,
  })
}

export default fp(deviceServicePlugin)