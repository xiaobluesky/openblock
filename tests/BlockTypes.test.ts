/**
 * OpenBlock - 块类型单元测试
 */

import { describe, it, expect } from 'vitest'
import { BlockType, createBlock, createPage, generateId } from '../src/core/BlockTypes'

describe('BlockTypes', () => {
  describe('generateId', () => {
    it('应该生成唯一 ID', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).not.toBe(id2)
    })

    it('应该包含时间戳', () => {
      const id = generateId()
      const timestamp = parseInt(id.split('-')[0])
      expect(timestamp).toBeGreaterThan(Date.now() - 1000)
    })
  })

  describe('createBlock', () => {
    it('应该创建文本块', () => {
      const block = createBlock(BlockType.TEXT, 'Hello World')
      
      expect(block.id).toBeDefined()
      expect(block.type).toBe(BlockType.TEXT)
      expect(block.content).toBe('Hello World')
      expect(block.createdAt).toBeGreaterThan(0)
      expect(block.updatedAt).toBeGreaterThan(0)
    })

    it('应该创建待办事项块', () => {
      const block = createBlock(BlockType.TODO, '完成任务', {
        checked: false
      })
      
      expect(block.type).toBe(BlockType.TODO)
      expect(block.metadata?.checked).toBe(false)
    })

    it('应该创建代码块', () => {
      const block = createBlock(BlockType.CODE_BLOCK, 'console.log("hi")', {
        language: 'javascript'
      })
      
      expect(block.type).toBe(BlockType.CODE_BLOCK)
      expect(block.metadata?.language).toBe('javascript')
    })
  })

  describe('createPage', () => {
    it('应该创建页面', () => {
      const page = createPage('测试页面')
      
      expect(page.id).toBeDefined()
      expect(page.title).toBe('测试页面')
      expect(page.blocks).toHaveLength(1)
      expect(page.childrenIds).toEqual([])
      expect(page.tags).toEqual([])
    })

    it('应该创建子页面', () => {
      const parentPage = createPage('父页面')
      const childPage = createPage('子页面', parentPage.id)
      
      expect(childPage.parentId).toBe(parentPage.id)
    })
  })
})
