export interface Item {
  id: number
  name: string
  content: string
}

// 模拟列表数据（根据角色返回）
export const mockList: Item[] = [
  { id: 1, name: 'Item A', content: 'Protected content 1' },
  { id: 2, name: 'Item B', content: 'Protected content 2' },
]
