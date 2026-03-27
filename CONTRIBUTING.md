# 贡献指南 🤝

感谢你对 OpenBlock 的兴趣！我们欢迎所有形式的贡献。

---

## 📋 行为准则

- 尊重他人，友好交流
- 对事不对人，聚焦技术问题
- 欢迎新手，耐心指导
- 禁止任何形式的歧视/骚扰

---

## 🚀 如何贡献

### 1. 报告问题 (Bug Reports)

在 [Issues](https://github.com/昊尘 002/openblock/issues) 中提交：
- 清晰的问题描述
- 复现步骤
- 预期行为 vs 实际行为
- 环境信息 (OS, 浏览器，版本)

### 2. 功能建议 (Feature Requests)

在 [Discussions](https://github.com/昊尘 002/openblock/discussions) 中提出：
- 功能描述和使用场景
- 为什么需要这个功能
- 可能的实现思路

### 3. 提交代码 (Code Contributions)

```bash
# Fork 项目
git clone https://github.com/YOUR_USERNAME/openblock.git

# 创建分支
git checkout -b feat/your-feature-name

# 开发完成后提交
git commit -m "feat: 添加 xxx 功能"

# 推送并创建 PR
git push origin feat/your-feature-name
```

### 4. 改进文档

- 修正错别字
- 补充使用说明
- 添加示例
- 翻译 (欢迎多语言版本!)

---

## 📐 代码规范

### 提交信息格式

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Type 类型:**
- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `style:` 代码格式 (不影响功能)
- `refactor:` 重构
- `test:` 测试相关
- `chore:` 构建/工具链

**示例:**
```
feat(editor): 添加代码块语法高亮

- 集成 Prism.js
- 支持 10 种常用语言

Closes #42
```

### 代码风格

- 使用 TypeScript
- 遵循 ESLint 规则
- 函数/组件添加 JSDoc 注释
- 测试覆盖率 > 80%

---

## ⚖️ Clean Room Design 原则

**重要：** OpenBlock 采用 Clean Room Design，贡献者必须遵守：

1. **不参考专有源代码** - 包括 Notion 等商业产品的源码
2. **不反编译** - 禁止逆向工程
3. **独立实现** - 基于公开文档和需求独立开发
4. **差异化设计** - UI/UX 避免直接复制

提交 PR 即表示你确认代码为原创实现。

---

## 🧪 开发环境

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 运行测试
npm test

# 代码检查
npm run lint
npm run typecheck
```

---

## 📬 联系方式

- 问题讨论：[GitHub Issues](https://github.com/昊尘 002/openblock/issues)
- 功能建议：[GitHub Discussions](https://github.com/昊尘 002/openblock/discussions)

---

再次感谢你的贡献！🎉
