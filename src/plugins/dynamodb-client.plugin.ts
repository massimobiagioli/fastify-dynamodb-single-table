import fp from 'fastify-plugin'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { FastifyInstance } from 'fastify'
import { Entity, Table } from 'dynamodb-toolbox'

declare module 'fastify' {
  interface FastifyInstance {
    dynamoDbClient: {
      Area: typeof AreaEntity
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
  DocumentClient
})

const AreaEntity = new Entity({
  name: 'AREA',

  attributes: {
    id: { partitionKey: true },
    sk: { sortKey: true, default: (data: { areaId: string, type: string }) => `${data.areaId}#${data.type}` },
    type: { type: 'string', required: true },
    name: { type: 'string', required: true, map: 'areaName' },
    areaId: { type: 'string', required: true },
    manager: { type: 'string', required: true },
    location: { type: 'string', required: true },
  },

  table: SingleTableDemo
} as const)

async function dynamoDbClientPlugin(app: FastifyInstance): Promise<void> {
  app.decorate('dynamoDbClient', {
    Area: AreaEntity
  })
}

export default fp(dynamoDbClientPlugin)