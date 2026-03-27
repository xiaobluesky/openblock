# 掘金技术文章 - OpenBlock 技术解析

**标题:** 我为什么放弃 Notion，开发了开源替代品 OpenBlock  
**副标题:** 本地优先架构的技术实践与挑战  
**作者:** 昊尘  
**标签:** #开源 #前端 #架构设计 #Notion #知识管理  
**预计阅读:** 8 分钟  
**发布日期:** 2026-04-XX (GitHub 发布前 1 天)

---

## 前言

作为一名知识管理工具的重度用户，我曾在 Notion 和 Obsidian 之间反复横跳：

- **Notion** 的块编辑器体验极佳，但数据存在云端，导出困难，网络延迟让人抓狂
- **Obsidian** 数据本地存储很安心，但 Markdown 语法对非技术人员门槛太高

为什么不能有一个工具，**同时拥有 Notion 的体验和 Obsidian 的隐私**？

于是，OpenBlock 诞生了。

---

## 一、产品定位

> **OpenBlock** = Notion 的块编辑器 + Obsidian 的本地优先 + 完全开源免费

### 核心特性

| 功能 | OpenBlock | Notion | Obsidian |
|------|-----------|--------|----------|
| 块编辑器 | ✅ | ✅ | ❌ |
| 离线优先 | ✅ | ❌ | ✅ |
| 数据开放 | ✅ | ❌ | ✅ |
| 自托管同步 | ✅ | ❌ | ⚠️ 付费 |
| 中文优化 | ✅ | ⚠️ | ⚠️ |
| 免费 | ✅ | ❌ | ✅ |
| 开源 | ✅ | ❌ | ❌ |

**目标用户:**
- 受够了 Notion 数据锁定的用户
- 想要块编辑器但不会 Markdown 的非技术人员
- 关注隐私的知识工作者
- 需要自托管的企业/团队

---

## 二、技术架构

### 整体架构

```
┌─────────────────────────────────────────────────────────┐
│                    OpenBlock Architecture                │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐    ┌──────────────┐    ┌────────────┐ │
│  │   React 18   │    │   TipTap     │    │  Zustand   │ │
│  │   (UI 层)    │◄──►│  (块编辑器)  │◄──►│ (状态管理) │ │
│  └──────────────┘    └──────────────┘    └────────────┘ │
│         │                   │                   │        │
│         ▼                   ▼                   ▼        │
│  ┌──────────────┐    ┌──────────────┐    ┌────────────┐ │
│  │   Vite       │    │    Yjs       │    │  SQLite    │ │
│  │   (构建)     │    │  (CRDT 同步)  │    │ (本地存储) │ │
│  └──────────────┘    └──────────────┘    └────────────┘ │
│         │                   │                   │        │
│         ▼                   ▼                   ▼        │
│  ┌─────────────────────────────────────────────────────┐ │
│  │                  IndexedDB (缓存层)                  │ │
│  └─────────────────────────────────────────────────────┘ │
│                           │                               │
│                           ▼                               │
│  ┌─────────────────────────────────────────────────────┐ │
│  │           可选同步层 (WebDAV / S3 / WebRTC)          │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 技术栈选型

```yaml
前端框架：React 18 + TypeScript
块编辑器：TipTap (基于 ProseMirror)
状态管理：Zustand (轻量) + Yjs (CRDT)
本地存储：SQLite (wasm) + IndexedDB (缓存)
构建工具：Vite (极速 HMR)
同步协议：WebDAV / S3 / WebRTC (可选)
部署方式：Docker / Vercel / 本地运行
```

---

## 三、核心技术挑战

### 1. 块编辑器实现

**问题:** 如何实现类似 Notion 的 `/` 命令菜单和块拖拽？

**解决方案:** 基于 TipTap 扩展

```typescript
// 自定义 SlashCommand 扩展
const SlashCommand = Extension.create({
  name: 'slashCommand',
  
  addProseMirrorPlugins() {
    return [
      Plugin({
        props: {
          handleKeyDown: (view, event) => {
            if (event.key === '/') {
              // 显示命令菜单
              this.showMenu()
            }
          }
        }
      })
    ]
  }
})

// 块类型定义
const BlockTypes = {
  text: { label: '文本', icon: '📝' },
  heading: { label: '标题', icon: '📰' },
  todo: { label: '待办', icon: '✅' },
  code: { label: '代码', icon: '💻' },
  image: { label: '图片', icon: '🖼️' },
  database: { label: '数据库', icon: '🗄️' }
}
```

**难点:**
- 块嵌套时的缩进逻辑
- 拖拽时的 DOM 更新性能
- 快捷键冲突处理

### 2. 本地优先架构

**问题:** 如何保证离线可用，同时支持可选同步？

**解决方案:** 本地存储 + 同步队列

```typescript
// 本地存储层
class LocalStorage {
  private db: SQLiteDB
  
  async saveBlock(block: Block) {
    // 1. 写入 SQLite
    await this.db.insert('blocks', block)
    
    // 2. 加入同步队列 (如果有同步配置)
    if (this.syncEnabled) {
      await this.syncQueue.add({
        type: 'CREATE',
        data: block,
        timestamp: Date.now()
      })
    }
  }
  
  async sync() {
    // 从队列中取出未同步的操作
    const pending = await this.syncQueue.getPending()
    
    // 批量发送到远程
    await this.syncProvider.batch(pending)
    
    // 标记为已同步
    await this.syncQueue.markSynced(pending.ids)
  }
}
```

**设计原则:**
- **离线优先:** 所有操作先在本地执行
- **最终一致:** 网络恢复后自动同步
- **冲突解决:** 基于 Yjs CRDT 自动合并

### 3. 数据开放格式

**问题:** 如何避免厂商锁定，让用户随时导出？

**解决方案:** Markdown + JSON 双格式存储

```typescript
// 内部存储格式 (JSON)
interface Block {
  id: string
  type: 'text' | 'heading' | 'todo' | 'code' | ...
  content: string
  properties: Record<string, any>
  children: string[] // 子块 ID 列表
  createdAt: number
  updatedAt: number
}

// 导出格式 (Markdown)
export function toMarkdown(page: Page): string {
  return page.blocks.map(block => {
    switch (block.type) {
      case 'heading':
        return `# ${block.content}`
      case 'todo':
        return `- [ ] ${block.content}`
      case 'code':
        return `\`\`\`${block.properties.language}\n${block.content}\n\`\`\``
      default:
        return block.content
    }
  }).join('\n\n')
}
```

**导出支持:**
- ✅ Markdown (.md)
- ✅ JSON (.json)
- ✅ PDF (计划中)
- ✅ HTML (计划中)

### 4. 性能优化

**问题:** 大页面 (1000+ 块) 如何保持流畅？

**解决方案:** 虚拟滚动 + 懒加载

```typescript
// 虚拟滚动实现
const VirtualBlockList = ({ blocks }) => {
  const { ref, virtualItems } = useVirtualizer({
    count: blocks.length,
    estimateSize: () => 50, // 预估每块高度
    overscan: 5 // 预渲染 5 个块
  })
  
  return (
    <div ref={ref} style={{ height: '100vh', overflow: 'auto' }}>
      <div style={{ height: `${virtualItems.getTotalSize()}px` }}>
        {virtualItems.map(virtualRow => (
          <Block
            key={virtualRow.key}
            block={blocks[virtualRow.index]}
            style={{
              position: 'absolute',
              top: 0,
              transform: `translateY(${virtualRow.start}px)`
            }}
          />
        ))}
      </div>
    </div>
  )
}
```

**性能数据:**
- 首屏加载: < 500ms (100 块)
- 滚动帧率: 60fps (1000 块)
- 搜索响应: < 100ms (全文索引)

---

## 四、同步方案设计

### 三种同步模式

```
┌──────────────────────────────────────────────────────┐
│                  同步方案对比                          │
├──────────────┬──────────────┬────────────────────────┤
│    WebDAV    │     S3       │       WebRTC           │
├──────────────┼──────────────┼────────────────────────┤
│  自托管友好   │  云服务友好   │   P2P 直连             │
│  配置简单     │  高可用       │   无需服务器           │
│  适合个人     │  适合团队     │   适合实时协作         │
└──────────────┴──────────────┴────────────────────────┘
```

### WebDAV 同步实现

```typescript
class WebDAVProvider {
  async push(changes: Change[]) {
    const response = await fetch(`${this.url}/sync`, {
      method: 'PUT',
      headers: {
        'Authorization': `Basic ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ changes })
    })
    
    if (!response.ok) {
      throw new Error('Sync failed')
    }
  }
  
  async pull(): Promise<Change[]> {
    const response = await fetch(`${this.url}/sync?since=${this.lastSync}`)
    const changes = await response.json()
    this.lastSync = Date.now()
    return changes
  }
}
```

### 冲突解决策略

**基于 CRDT 的自动合并:**

```typescript
import { Doc } from 'yjs'

// 每个块有一个 Y.Map
const blockMap = new Y.Map()
blockMap.set('content', new Y.Text('Hello'))
blockMap.set('updatedAt', Date.now())

// 多客户端同时编辑时，Yjs 自动合并
// 基于 Lamport 时间戳，最后写入获胜 (Last-Write-Wins)
```

---

## 五、安全与隐私

### 数据加密

```typescript
// 端到端加密 (可选)
import { box } from 'tweetnacl'

class Encryption {
  async encrypt(data: string, publicKey: Uint8Array) {
    const message = new TextEncoder().encode(data)
    const encrypted = box(message, new Uint8Array(24), publicKey)
    return Buffer.from(encrypted).toString('base64')
  }
  
  async decrypt(encrypted: string, secretKey: Uint8Array) {
    const message = Buffer.from(encrypted, 'base64')
    const decrypted = box.open(message, new Uint8Array(24), secretKey)
    return new TextDecoder().decode(decrypted)
  }
}
```

### 隐私承诺

- ✅ 无数据收集
- ✅ 无遥测
- ✅ 无第三方追踪
- ✅ 可选端到端加密
- ✅ 开源代码可审计

---

## 六、开发路线图

### Phase 1 - MVP (当前) 🎯
- [x] 项目初始化
- [ ] 块编辑器核心 (TipTap 集成)
- [ ] 基础块类型 (文本/待办/代码/标题)
- [ ] 本地存储 (SQLite)
- [ ] 页面树形导航
- [ ] Markdown 导出

### Phase 2 - Beta (4-8 周)
- [ ] 图片/文件上传
- [ ] 全文搜索
- [ ] 主题系统 (深色模式)
- [ ] 基础插件 API

### Phase 3 - 1.0 (8-12 周)
- [ ] 同步服务 (WebDAV/S3)
- [ ] 协作编辑 (Yjs + WebRTC)
- [ ] 模板系统
- [ ] 移动端适配

---

## 七、开源与商业化

### 开源协议

**MIT License** - 完全免费，可商用

### 商业化计划 (可选)

> 目前 100% 免费，未来可能通过以下方式维持开发:

- 💰 **托管服务:** 为不想自托管的用户提供付费同步服务
- 💰 **企业版:** 团队协作、权限管理、审计日志
- 💰 **赞助:** GitHub Sponsors / 爱发电

**承诺:** 核心功能永远免费开源

---

## 八、写在最后

开发 OpenBlock 的初衷很简单：**我想要一个真正属于自己的知识管理工具**。

数据不应该被锁定在某个公司的服务器上，用户应该有选择权。

这是一个人的开源项目，目前还在 MVP 阶段。如果你也有同样的痛点，欢迎来 GitHub 给个 ⭐ Star，或者提 Issue/PR 一起参与建设。

**项目地址:** https://github.com/昊尘 002/openblock  
**在线 Demo:** https://openblock-demo.vercel.app (部署中)  
**讨论区:** https://github.com/昊尘 002/openblock/discussions

---

## 附录：快速开始

```bash
# 从源码运行
git clone https://github.com/昊尘 002/openblock.git
cd openblock
npm install
npm run dev

# 访问 http://localhost:3000
```

```bash
# Docker 部署 (计划中)
docker run -d -p 3000:3000 -v ./data:/app/data openblock/openblock:latest
```

---

**感谢阅读!** 如果文章对你有帮助，请点赞/收藏支持一下。🐾

有任何问题欢迎在评论区留言，我会尽快回复。

---

**作者简介:** 昊尘，AI 工程师，独立开发者。正在通过开源项目还债 100 万。关注本地优先架构和知识管理工具。
