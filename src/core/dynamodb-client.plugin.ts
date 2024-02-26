import fp from 'fastify-plugin'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { FastifyInstance } from 'fastify'
import { Entity, Table } from 'dynamodb-toolbox'

declare module 'fastify' {
  interface FastifyInstance {
    dynamoDbClient: {
      Area: typeof AreaEntity,
      Network: typeof NetworkEntity,
      Device: typeof DeviceEntity,
    }
  }
}

const marshallOptions = {
  convertEmptyValues: false,
  removeUndefinedValues: false,
  convertClassInstanceToMap: false,
}

const unmarshallOptions = {
  wrapNumbers: false,
}

const translateConfig = { marshallOptions, unmarshallOptions }

const DocumentClient = DynamoDBDocumentClient.from(new DynamoDBClient({}), translateConfig)

const SingleTableDemo = new Table({
  name: 'single-table-demo',
  partitionKey: 'pk',
  sortKey: 'sk',
  indexes: {
    gsi1: { partitionKey: 'gsi1pk', sortKey: 'gsi1sk' }
  },
  DocumentClient
})

const AreaEntity = new Entity({
  name: 'AREA',

  attributes: {
    id: {
      partitionKey: true,
      default: (data: { areaId: string, _et: string }) => `${data._et}#${data.areaId}`
    },
    sk: {
      sortKey: true,
      default: (data: { areaId: string, _et: string }) => `${data._et}#${data.areaId}`
    },
    name: { type: 'string', required: true, map: 'areaName' },
    areaId: { type: 'string', required: true },
    manager: { type: 'string', required: true },
    location: { type: 'string', required: true },
  },

  table: SingleTableDemo
} as const)

const NetworkEntity = new Entity({
  name: 'NETWORK',

  attributes: {
    id: {
      partitionKey: true ,
      default: (data: { areaId: string }) => `AREA#${data.areaId}`
    },
    sk: {
      sortKey: true,
      default: (data: { _et: string, areaId: string, networkId: string }) => `AREA#${data.areaId}#${data._et}#${data.networkId}`
    },
    areaId: { type: 'string', required: true },
    networkId: { type: 'string', required: true },
    networkType: { type: 'string', required: true },
    connectionSpeed: { type: 'string', required: true },
  },

  table: SingleTableDemo
} as const)

const DeviceEntity = new Entity({
  name: 'DEVICE',

  attributes: {
    id: { partitionKey: true },
    sk: {
      sortKey: true,
      default: (data: { id: string }) => `${data.id}`
    },
    gsi1pk: { type: 'string', required: true },
    gsi1sk: { type: 'string', required: true },
    type: { type: 'string', required: true },
    deviceId: { type: 'string', required: true },
    deviceName: { type: 'string', required: true },
    deviceType: { type: 'string', required: true },
    IPAddress: { type: 'string', required: true },
  },

  table: SingleTableDemo
} as const)

async function dynamoDbClientPlugin(app: FastifyInstance): Promise<void> {
  app.decorate('dynamoDbClient', {
    Area: AreaEntity,
    Network: NetworkEntity,
    Device: DeviceEntity,
  })
}

export default fp(dynamoDbClientPlugin)