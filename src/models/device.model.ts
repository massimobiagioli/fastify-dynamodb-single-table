import { Static, Type } from '@sinclair/typebox'

export const Device = Type.Object({
  id: Type.String(),
  name: Type.String(),
  type: Type.String(),
  IPAddress: Type.String(),
})

export type Device = Static<typeof Device>

export const DeviceCollection = Type.Array(Device)

export type DeviceCollection = Static<typeof DeviceCollection>