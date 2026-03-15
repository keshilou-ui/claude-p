import { useState, useRef, useEffect } from 'react'
import { Sparkles, Copy, Check, Braces } from 'lucide-react'

export default function PromptPanel({ prompt, isProcessing, hasTranscript, hasApiKey, onOptimize, onCopy }) {
  const [copied, setCopied] = useState(false)
  const [prevPrompt, setPrevPrompt] = useState('')
  const contentRef = useRef(null)

  useEffect(() => {
    if (prompt && prompt !== prevPrompt) {
      setPrevPrompt(prompt)
      if (contentRef.current) {
        contentRef.current.scrollTop = 0
      }
    }
  }, [prompt, prevPrompt])

  const handleCopy = async () => {
    await onCopy()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      {/* Panel header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-surface-1/50">
        <div className="flex items-center gap-2.5">
          <Braces size={14} className="text-cyan" />
          <h2 className="text-xs font-semibold tracking-widest uppercase text-text-2">
            Prompt 输出
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Optimize button */}
          <button
            onClick={onOptimize}
            disabled={!hasTranscript || isProcessing}
            className="group flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all duration-200
              border border-cyan/20 text-cyan hover:bg-cyan-glow hover:border-cyan/40
              disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-cyan/20"
          >
            <Sparkles size={13} className={isProcessing ? 'animate-spin' : ''} />
            {isProcessing ? '生成中…' : hasApiKey ? 'AI 优化' : '本地优化'}
          </button>

          {/* Copy button */}
          <button
            onClick={handleCopy}
            disabled={!prompt}
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all duration-200
              text-text-2 hover:text-text-0 hover:bg-surface-2
              disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-text-2"
          >
            {copied ? (
              <>
                <Check size={13} className="text-emerald" />
                <span className="text-emerald">已复制</span>
              </>
            ) : (
              <>
                <Copy size={13} />
                <span>复制</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content area */}
      <div ref={contentRef} className="flex-1 overflow-auto">
        {prompt ? (
          <div className="p-5 animate-float-in">
            {prompt.split('\n').map((line, i) => {
              // Section headers (## heading)
              if (line.startsWith('## ')) {
                return (
                  <h3
                    key={i}
                    className="text-sm font-semibold text-cyan mt-5 mb-3 first:mt-0 pb-2 border-b border-cyan/10"
                  >
                    {line.replace('## ', '')}
                  </h3>
                )
              }
              // Numbered items
              if (/^\d+\.\s/.test(line)) {
                const num = line.match(/^(\d+)\./)[1]
                const text = line.replace(/^\d+\.\s*/, '')
                return (
                  <div key={i} className="flex gap-3 py-1.5 group/line">
                    <span className="flex-none w-5 h-5 rounded bg-cyan/8 text-cyan text-[10px] font-bold font-[var(--font-mono)] flex items-center justify-center mt-0.5">
                      {num}
                    </span>
                    <span className="text-sm text-text-0 leading-relaxed">{text}</span>
                  </div>
                )
              }
              // Bullet items
              if (line.startsWith('- ')) {
                return (
                  <div key={i} className="flex gap-3 py-1 pl-1">
                    <span className="flex-none w-1.5 h-1.5 rounded-full bg-text-3 mt-2" />
                    <span className="text-sm text-text-1 leading-relaxed">{line.replace('- ', '')}</span>
                  </div>
                )
              }
              // Empty line
              if (!line.trim()) {
                return <div key={i} className="h-2" />
              }
              // Regular text
              return (
                <p key={i} className="text-sm text-text-1 leading-relaxed py-0.5">
                  {line}
                </p>
              )
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center animate-float-in">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-cyan-glow flex items-center justify-center">
                <Braces size={24} className="text-cyan-dim" />
              </div>
              <p className="text-text-3 text-sm mb-1">等待 Prompt 生成</p>
              <p className="text-text-3/60 text-xs">录入语音后点击「优化 Prompt」</p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
