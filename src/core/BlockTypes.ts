/**
 * OpenBlock - 块类型定义
 * 
 * Clean Room Design - 独立实现
 */

/**
 * 支持的块类型枚举
 */
export enum BlockType {
  TEXT = 'text',
  HEADING_1 = 'heading1',
  HEADING_2 = 'heading2',
  HEADING_3 = 'heading3',
  TODO = 'todo',
  BULLET_LIST = 'bulletList',
  NUMBERED_LIST = 'numberedList',
  CODE_BLOCK = 'codeBlock',
  QUOTE = 'quote',
  DIVIDER = 'divider',
  IMAGE = 'image',
  FILE = 'file'
}

/**
 * 块数据结构
 */
export interface Block {
  id: string
  type: BlockType
  content: string
  metadata?: BlockMetadata
  createdAt: number
  updatedAt: number
}

/**
 * 块元数据 (不同类型有不同的 metadata)
 */
export interface BlockMetadata {
  // 待办事项
  checked?: boolean
  
  // 代码块
  language?: string
  
  // 图片/文件
  url?: string
  caption?: string
  size?: number
  
  // 通用
  collapsed?: boolean
}

/**
 * 页面数据结构
 */
export interface Page {
  id: string
  title: string
  blocks: Block[]
  parentId?: string
  childrenIds: string[]
  createdAt: number
  updatedAt: number
  tags: string[]
}

/**
 * 块类型配置
 */
export const BLOCK_CONFIGS: Record<BlockType, {
  label: string
  shortcut: string
  icon: string
}> = {
  [BlockType.TEXT]: { label: '文本', shortcut: 'text', icon: '📝' },
  [BlockType.HEADING_1]: { label: '标题 1', shortcut: 'h1', icon: 'H1' },
  [BlockType.HEADING_2]: { label: '标题 2', shortcut: 'h2', icon: 'H2' },
  [BlockType.HEADING_3]: { label: '标题 3', shortcut: 'h3', icon: 'H3' },
  [BlockType.TODO]: { label: '待办事项', shortcut: 'todo', icon: '☐' },
  [BlockType.BULLET_LIST]: { label: '无序列表', shortcut: 'bullet', icon: '•' },
  [BlockType.NUMBERED_LIST]: { label: '有序列表', shortcut: 'numbered', icon: '1.' },
  [BlockType.CODE_BLOCK]: { label: '代码块', shortcut: 'code', icon: '</>' },
  [BlockType.QUOTE]: { label: '引用', shortcut: 'quote', icon: '"' },
  [BlockType.DIVIDER]: { label: '分割线', shortcut: 'divider', icon: '—' },
  [BlockType.IMAGE]: { label: '图片', shortcut: 'image', icon: '🖼️' },
  [BlockType.FILE]: { label: '文件', shortcut: 'file', icon: '📎' }
}

/**
 * 生成唯一 ID
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 创建新块
 */
export const createBlock = (
  type: BlockType = BlockType.TEXT,
  content: string = '',
  metadata?: BlockMetadata
): Block => {
  const now = Date.now()
  return {
    id: generateId(),
    type,
    content,
    metadata,
    createdAt: now,
    updatedAt: now
  }
}

/**
 * 创建新页面
 */
export const createPage = (
  title: string = '无标题页面',
  parentId?: string
): Page => {
  const now = Date.now()
  return {
    id: generateId(),
    title,
    blocks: [createBlock(BlockType.TEXT)],
    parentId,
    childrenIds: [],
    createdAt: now,
    updatedAt: now,
    tags: []
  }
}
