# OpenBlock 🧱

<div align="center">

![OpenBlock Banner](public/banner.svg)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Status: MVP Development](https://img.shields.io/badge/Status-MVP%20Development-orange)](https://github.com/xiaobluesky/openblock)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Deployed with Vercel](https://img.shields.io/badge/Deployed%20with-Vercel-black?logo=vercel)](https://vercel.com)

**Notion's Open-Source Privacy Alternative — Your data belongs to you, not companies.**

**中文** · **English** · [Live Demo](https://openblock.vercel.app) · [Docs](./docs)

</div>

---

## ⚡ Quick Start (5 minutes)

### Option 1: Docker One-Liner (Recommended)

```bash
docker run -d -p 3000:3000 -v ./data:/app/data openblock/openblock:latest
```

Visit http://localhost:3000 to start using immediately.

### Option 2: Live Demo

No installation needed → **https://openblock.vercel.app**

### Option 3: Build from Source

```bash
git clone https://github.com/xiaobluesky/openblock.git
cd openblock
npm install
npm run dev
```

Visit http://localhost:5173 to start development.

---

## 🎯 Why OpenBlock?

> After 3 years of using Notion daily, I was frustrated by: **hard data export, no offline mode, privacy concerns, slow performance in China**.

OpenBlock solves these problems with a **local-first, open-format** approach.

### ✨ Core Features

- 🏠 **Local-First** - Works offline, data stored locally
- 🔓 **Open Format** - Markdown + JSON, export anytime
- 🔄 **Optional Sync** - WebDAV/S3/WebRTC, self-hosted
- 🇨🇳 **China Optimized** - Native Chinese, no latency
- 🛡️ **Privacy First** - No data collection, optional E2E encryption
- 🧩 **Plugin System** - Open plugin architecture

---

## 📊 Comparison

| Feature | OpenBlock | Notion | Obsidian |
|---------|-----------|--------|----------|
| Block Editor | ✅ | ✅ | ❌ (Markdown) |
| Offline First | ✅ | ❌ | ✅ |
| Open Data | ✅ | ❌ | ✅ |
| Self-Hosted Sync | ✅ | ❌ | ⚠️ (Paid) |
| China Optimized | ✅ | ⚠️ | ⚠️ |
| Free | ✅ | ❌ | ✅ |
| Open Source | ✅ | ❌ | ❌ |

---

## 📦 Tech Stack

```
Frontend: React 18 + TypeScript + TipTap (Block Editor)
State: Zustand + Yjs (CRDT Sync)
Storage: SQLite (Local) + IndexedDB (Cache)
Backend: Node.js + Express (Optional Sync Service)
Deploy: Docker + Vite (Build)
```

---

## 🗺️ Roadmap

### Phase 1 - MVP (Current) 🎯
- [x] Project Initialization
- [ ] Block Editor Core (TipTap Integration)
- [ ] Basic Block Types (Text/Todo/Code/Heading)
- [ ] Local Storage (SQLite)
- [ ] Page Tree Navigation
- [ ] Markdown Export

### Phase 2 - Beta (4-8 weeks)
- [ ] Image/File Upload
- [ ] Full-Text Search
- [ ] Theme System (Dark Mode)
- [ ] Basic Plugin API

### Phase 3 - 1.0 (8-12 weeks)
- [ ] Sync Service (WebDAV/S3)
- [ ] Collaborative Editing (Yjs + WebRTC)
- [ ] Template System
- [ ] Mobile Adaptation

---

## 🤝 Contributing

We welcome all contributions! See [CONTRIBUTING.md](CONTRIBUTING.md)

### Development Setup

```bash
# Clone repo
git clone https://github.com/xiaobluesky/openblock.git

# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm test
```

### Commit Conventions

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Refactoring
- `test:` Tests
- `chore:` Build/Tools

---

## 📄 License

MIT License - See [LICENSE](LICENSE)

---

## ⚖️ Legal Notice

OpenBlock is an independently developed open-source project, not affiliated with Notion Labs Inc.

- **Clean Room Design** - No proprietary source code referenced
- All code is original implementation
- Block editor concept is a common UI pattern, not patented
- Project name and Logo are original designs

---

## 📬 Contact

- GitHub Issues: [Report Issues](https://github.com/xiaobluesky/openblock/issues)
- Discussions: [GitHub Discussions](https://github.com/xiaobluesky/openblock/discussions)

---

<div align="center">

**If OpenBlock helps you, please give it a ⭐ Star!**

_Data should belong to users, not companies._

</div>
