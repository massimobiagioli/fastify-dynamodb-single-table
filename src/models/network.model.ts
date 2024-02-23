import { Static, Type } from '@sinclair/typebox'

export const Network = Type.Object({
  id: Type.String(),
  type: Type.String(),
  connectionSpeed: Type.String(),
})

export type Network = Static<typeof Network>

export const NetworkCollection = Type.Array(Network)

export type NetworkCollection = Static<typeof NetworkCollection>