import { Static, Type } from '@sinclair/typebox'

export const Area = Type.Object({
  id: Type.String(),
  name: Type.String(),
  manager: Type.String(),
  location: Type.String(),
})

export type Area = Static<typeof Area>

export const AreaListReply = Type.Array(Area)

export type AreaListReply = Static<typeof AreaListReply>