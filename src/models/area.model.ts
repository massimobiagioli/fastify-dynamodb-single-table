import { Static, Type } from '@sinclair/typebox'

export const Area = Type.Object({
  id: Type.String(),
  name: Type.String(),
  manager: Type.String(),
  location: Type.String(),
})

export type Area = Static<typeof Area>

export const AreaCollection = Type.Array(Area)

export type AreaCollection = Static<typeof AreaCollection>
