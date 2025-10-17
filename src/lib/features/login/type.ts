export type ListMenuRes = Array<{
  id: number
  name: string
  sub: Array<{
    id: number
    name: string
    count: number | null
  }>
  count: number | null
}>

