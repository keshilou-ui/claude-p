import { useState } from 'react'
import { X, Key, ExternalLink } from 'lucide-react'

export default function ApiKeyModal({ apiKey, onSave, onClose }) {
  const [key, setKey] = useState(apiKey)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(key.trim())
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-void/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 rounded-2xl bg-surface-1 border border-border shadow-2xl animate-float-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <Key size={15} className="text-cyan" />
            <h2 className="text-sm font-semibold text-text-0">DeepSeek API 设置</h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-text-2 hover:text-text-0 hover:bg-surface-2 cursor-pointer transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <label className="block text-xs text-text-2 mb-2 tracking-wide uppercase">
            API Key
          </label>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="sk-..."
            autoFocus
            className="w-full px-4 py-3 rounded-xl bg-surface-0 border border-border text-sm text-text-0 font-[var(--font-mono)]
              placeholder:text-text-3 outline-none focus:border-cyan/40 transition-colors"
          />
          <p className="mt-3 text-xs text-text-3 leading-relaxed">
            Key 仅存储在浏览器本地，不会上传到任何服务器。
          </p>

          <div className="flex items-center justify-between mt-6">
            <a
              href="https://platform.deepseek.com/api_keys"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-text-2 hover:text-cyan transition-colors"
            >
              获取 API Key <ExternalLink size={11} />
            </a>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs font-medium text-text-2 hover:text-text-0 hover:bg-surface-2 cursor-pointer transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-xs font-medium bg-cyan/15 text-cyan hover:bg-cyan/25 border border-cyan/20 cursor-pointer transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
