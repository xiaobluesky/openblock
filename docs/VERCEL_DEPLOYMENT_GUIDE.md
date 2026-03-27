# Vercel 部署指南

## 当前状态

✅ **Vercel 配置文件已创建** (`vercel.json`)
✅ **代码已推送到 GitHub**
⚠️ **需要手动完成 Vercel 部署**

## 为什么需要手动部署

Vercel CLI 需要认证 token 才能进行部署。当前环境未配置 Vercel 认证。

## 部署步骤（3 分钟完成）

### 方法 1: 通过 Vercel 网站（推荐）

1. 访问 [vercel.com](https://vercel.com)
2. 使用 GitHub 账号登录
3. 点击 "Add New Project"
4. 选择 `xiaobluesky/openblock` 仓库
5. 保持默认设置：
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. 点击 "Deploy"

### 方法 2: 通过 Vercel CLI（需要认证）

```bash
# 登录 Vercel
vercel login

# 部署到生产环境
cd /root/.openclaw/workspace/openblock
vercel --prod
```

## 部署后的配置

部署成功后，更新 README 中的 Demo 链接：

1. 获取 Vercel 分配的域名（例如：`openblock-xxx.vercel.app`）
2. （可选）绑定自定义域名（例如：`demo.openblock.dev`）
3. 更新 `README.md` 和 `README.en.md` 中的 Demo 链接

## 自动部署配置

启用 GitHub 集成后，每次推送到 `main` 分支都会自动部署：

1. 在 Vercel 项目设置中，进入 "Git" 选项卡
2. 确保 `main` 分支已连接
3. 启用 "Preview Deployments"（可选）

## 环境变量（如需要）

如果项目需要环境变量，在 Vercel 项目设置中添加：

- `NODE_VERSION`: 18
- 其他项目特定的变量

## 验证部署

部署完成后：

1. 访问 Vercel 提供的 URL
2. 检查页面加载正常
3. 测试核心功能
4. 更新 README 中的 Demo 链接

---

**下一步**: 完成 Vercel 部署后，更新 README 中的占位链接为真实 URL。
