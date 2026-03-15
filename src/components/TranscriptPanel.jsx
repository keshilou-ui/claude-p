import { useEffect, useRef } from 'react'
import { AudioLines, Pencil, Trash2 } from 'lucide-react'

export default function TranscriptPanel({ transcript, interimText, isListening, onTranscriptChange, onClear }) {
  const textareaRef = useRef(null)
  const lineNumbersRef = useRef(null)

  const displayText = transcript + (interimText || '')
  const lines = (displayText || ' ').split('\n')

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight
    }
  }, [transcript, interimText])

  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop
    }
  }

  return (
    <>
      {/* Panel header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-surface-1/50">
        <div className="flex items-center gap-2.5">
          <AudioLines size={14} className="text-amber" />
          <h2 className="text-xs font-semibold tracking-widest uppercase text-text-2">
            语音转录
          </h2>
        </div>
        {!isListening && transcript && (
          <div className="flex items-center gap-3 animate-fade-in">
            <div className="flex items-center gap-1.5 text-text-3">
              <Pencil size={11} />
              <span className="text-[10px] tracking-wide uppercase">可编辑</span>
            </div>
            <button
              onClick={onClear}
              className="flex items-center gap-1.5 text-text-3 hover:text-rose cursor-pointer transition-colors"
              title="清空转录和 Prompt"
            >
              <Trash2 size={11} />
              <span className="text-[10px] tracking-wide uppercase">清空</span>
            </button>
          </div>
        )}
      </div>

      {/* Editor body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Line numbers gutter */}
        <div
          ref={lineNumbersRef}
          className="flex-none w-12 py-4 bg-surface-1/30 border-r border-border overflow-hidden select-none"
        >
          {lines.map((_, i) => (
            <div
              key={i}
              className="text-[11px] leading-7 text-text-3 text-right pr-3 font-[var(--font-mono)]"
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Textarea */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={displayText}
            onChange={(e) => onTranscriptChange(e.target.value)}
            onScroll={handleScroll}
            readOnly={isListening}
            placeholder="点击上方麦克风按钮，开始说出你的想法…"
            className="absolute inset-0 w-full h-full px-5 py-4 bg-transparent text-text-0 text-sm leading-7 resize-none outline-none placeholder:text-text-3/60"
            spellCheck={false}
          />

          {/* Interim text highlight bar */}
          {isListening && interimText && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber/40 via-amber to-amber/40 animate-fade-in" />
          )}
        </div>

        {/* Empty state */}
        {!displayText.trim() && !isListening && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center animate-float-in">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-glow flex items-center justify-center">
                <AudioLines size={24} className="text-amber-dim" />
              </div>
              <p className="text-text-3 text-sm">等待语音输入</p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
