import { Static, Type } from '@sinclair/typebox'
import { Area } from '@models/area.model'

export const Network = Type.Object({
  id: Type.String(),
  areaId: Type.String(),
  type: Type.String(),
  connectionSpeed: Type.String(),
})

export type Network = Static<typeof Network>

export const NetworkCollection = Type.Array(Network)

export type NetworkCollection = Static<typeof NetworkCollection>

export const NetworkWithArea = Type.Object({
  area: Area,
  networks: NetworkCollection,
})

export type NetworkWithArea = Static<typeof NetworkWithArea>