/**
 * OpenBlock - 本地存储层
 * 
 * 使用 SQLite (better-sqlite3) 实现本地持久化
 * Clean Room Design - 独立实现
 */

import type { Block, Page } from './BlockTypes'

/**
 * 存储接口 (抽象层，便于未来扩展 IndexedDB/云同步)
 */
export interface StorageAdapter {
  init(): Promise<void>
  savePage(page: Page): Promise<void>
  getPage(id: string): Promise<Page | null>
  deletePage(id: string): Promise<void>
  getAllPages(): Promise<Page[]>
  searchPages(query: string): Promise<Page[]>
  exportPage(id: string): Promise<string>
}

/**
 * SQLite 存储实现
 */
export class SQLiteStorage implements StorageAdapter {
  private db: any = null
  private dbPath: string

  constructor(dbPath: string = './openblock.db') {
    this.dbPath = dbPath
  }

  async init(): Promise<void> {
    // 延迟加载 better-sqlite3 (避免浏览器环境报错)
    const Database = (await import('better-sqlite3')).default
    
    this.db = new Database(this.dbPath)
    
    // 创建页面表
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS pages (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        blocks TEXT NOT NULL,
        parent_id TEXT,
        children_ids TEXT NOT NULL,
        tags TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    `)
    
    // 创建索引
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_pages_parent ON pages(parent_id)
      CREATE INDEX IF NOT EXISTS idx_pages_updated ON pages(updated_at DESC)
    `)
  }

  async savePage(page: Page): Promise<void> {
    if (!this.db) await this.init()

    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO pages 
      (id, title, blocks, parent_id, children_ids, tags, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)

    stmt.run(
      page.id,
      page.title,
      JSON.stringify(page.blocks),
      page.parentId || null,
      JSON.stringify(page.childrenIds),
      JSON.stringify(page.tags),
      page.createdAt,
      page.updatedAt
    )
  }

  async getPage(id: string): Promise<Page | null> {
    if (!this.db) await this.init()

    const stmt = this.db.prepare('SELECT * FROM pages WHERE id = ?')
    const row = stmt.get(id)

    if (!row) return null

    return {
      id: row.id,
      title: row.title,
      blocks: JSON.parse(row.blocks),
      parentId: row.parent_id,
      childrenIds: JSON.parse(row.children_ids),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      tags: JSON.parse(row.tags)
    } as Page
  }

  async deletePage(id: string): Promise<void> {
    if (!this.db) await this.init()

    const stmt = this.db.prepare('DELETE FROM pages WHERE id = ?')
    stmt.run(id)
  }

  async getAllPages(): Promise<Page[]> {
    if (!this.db) await this.init()

    const stmt = this.db.prepare('SELECT * FROM pages ORDER BY updated_at DESC')
    const rows = stmt.all()

    return rows.map(row => ({
      id: row.id,
      title: row.title,
      blocks: JSON.parse(row.blocks),
      parentId: row.parent_id,
      childrenIds: JSON.parse(row.children_ids),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      tags: JSON.parse(row.tags)
    })) as Page[]
  }

  async searchPages(query: string): Promise<Page[]> {
    if (!this.db) await this.init()

    const stmt = this.db.prepare(`
      SELECT * FROM pages 
      WHERE title LIKE ? OR blocks LIKE ?
      ORDER BY updated_at DESC
    `)

    const searchPattern = `%${query}%`
    const rows = stmt.all(searchPattern, searchPattern)

    return rows.map(row => ({
      id: row.id,
      title: row.title,
      blocks: JSON.parse(row.blocks),
      parentId: row.parent_id,
      childrenIds: JSON.parse(row.children_ids),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      tags: JSON.parse(row.tags)
    })) as Page[]
  }

  async exportPage(id: string): Promise<string> {
    const page = await this.getPage(id)
    if (!page) throw new Error(`Page ${id} not found`)

    // 导出为 Markdown
    let markdown = `# ${page.title}\n\n`

    for (const block of page.blocks) {
      markdown += this.blockToMarkdown(block)
    }

    return markdown
  }

  /**
   * 块转 Markdown (私有方法)
   */
  private blockToMarkdown(block: Block): string {
    switch (block.type) {
      case 'heading1':
        return `# ${block.content}\n\n`
      case 'heading2':
        return `## ${block.content}\n\n`
      case 'heading3':
        return `### ${block.content}\n\n`
      case 'todo':
        const checkbox = block.metadata?.checked ? '[x]' : '[ ]'
        return `- ${checkbox} ${block.content}\n`
      case 'bulletList':
        return `- ${block.content}\n`
      case 'numberedList':
        return `1. ${block.content}\n`
      case 'codeBlock':
        return `\`\`\`${block.metadata?.language || ''}\n${block.content}\n\`\`\`\n\n`
      case 'quote':
        return `> ${block.content}\n\n`
      case 'divider':
        return `---\n\n`
      default:
        return `${block.content}\n\n`
    }
  }

  /**
   * 关闭数据库连接
   */
  async close(): Promise<void> {
    if (this.db) {
      this.db.close()
      this.db = null
    }
  }
}

/**
 * 默认存储实例
 */
export const defaultStorage = new SQLiteStorage()
