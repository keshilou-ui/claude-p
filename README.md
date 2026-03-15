# VoicePrompt-Gen

语音转 Prompt 辅助工具 —— 口述你的想法，AI 帮你重构为结构化的编程 Prompt，适用于 Vibe Coding 工作流。

## 功能

- **语音实时转录** — 基于 Web Speech API，边说边看
- **AI 智能重构** — 接入 DeepSeek API，将口语化描述转为结构清晰的 Prompt
- **本地离线模式** — 未配置 API Key 时自动使用本地分句整理
- **一键复制** — 生成的 Prompt 可直接复制粘贴到 Claude / Cursor 等工具

## 快速开始

### 环境要求

- [Node.js](https://nodejs.org/) 18+
- Chrome 或 Edge 浏览器（语音识别需要）

### 安装与运行

```bash
# 1. 克隆项目
git clone https://github.com/keshilou-ui/claude-p.git
cd claude-p

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev
```

启动后在浏览器打开终端显示的地址（默认 `http://localhost:5173`）。

### 配置 DeepSeek API（可选）

不配置也能使用（本地模式），配置后可获得 AI 智能重构能力：

1. 前往 [DeepSeek 开放平台](https://platform.deepseek.com/api_keys) 注册并创建 API Key
2. 打开应用，点击右上角 **API** 按钮
3. 粘贴 API Key，点击保存

> API Key 仅存储在你的浏览器本地（localStorage），不会上传到任何服务器。

## 使用方法

1. 点击顶部 **麦克风按钮** 开始录音（首次使用需授权麦克风）
2. 说出你的想法，左侧面板会实时显示转录文本
3. 点击麦克风按钮停止录音，此时可以手动编辑转录文本
4. 点击右侧 **AI 优化 / 本地优化** 按钮，生成结构化 Prompt
5. 点击 **复制** 按钮，粘贴到你的 AI 编程工具中使用

## 技术栈

- React 19
- Vite 8
- Tailwind CSS 4
- Lucide React（图标）
- DeepSeek API（可选）

## License

MIT
