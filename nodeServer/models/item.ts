export interface Item {
  id: number
  name: string
  content: string
}

export const mockList: Item[] = [
  { id: 1, name: 'Item A', content: 'Protected content 1' },
  { id: 2, name: 'Item B', content: 'Protected content 2' },
]