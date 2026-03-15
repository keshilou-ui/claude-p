import { Mic, Square, Settings } from 'lucide-react'

function WaveformBars() {
  return (
    <div className="flex items-center gap-[3px] h-4">
      {[0, 1, 2, 3, 4].map(i => (
        <div
          key={i}
          className="w-[3px] h-full bg-amber rounded-full origin-bottom"
          style={{
            animation: `wave-bar 0.8s ease-in-out ${i * 0.12}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

export default function Header({ status, hasApiKey, onToggleRecording, onOpenSettings }) {
  const isRecording = status === 'recording'
  const isProcessing = status === 'processing'

  return (
    <header className="relative flex items-center justify-between px-6 py-4">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber to-cyan flex items-center justify-center">
          <span className="text-void text-xs font-bold font-[var(--font-mono)]">VP</span>
        </div>
        <h1 className="text-base font-semibold tracking-tight text-text-0">
          VoicePrompt<span className="text-text-2">-Gen</span>
        </h1>
      </div>

      {/* Center: Record Button */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-4">
        <button
          onClick={onToggleRecording}
          className="relative group cursor-pointer"
        >
          {isRecording && (
            <span
              className="absolute inset-0 rounded-full border-2 border-amber"
              style={{ animation: 'pulse-ring 1.8s ease-out infinite' }}
            />
          )}

          <div
            className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
              isRecording
                ? 'bg-amber shadow-[0_0_24px_rgba(240,180,41,0.4)]'
                : 'bg-surface-2 hover:bg-surface-3 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]'
            }`}
          >
            {isRecording ? (
              <Square size={16} className="text-void" fill="currentColor" />
            ) : (
              <Mic size={18} className="text-text-1 group-hover:text-text-0 transition-colors" />
            )}
          </div>
        </button>

        <div className="flex items-center gap-2.5 min-w-[120px]">
          {isRecording ? (
            <>
              <WaveformBars />
              <span className="text-sm text-amber font-medium">录音中</span>
            </>
          ) : isProcessing ? (
            <>
              <div
                className="w-4 h-4 rounded-full border-2 border-cyan border-t-transparent"
                style={{ animation: 'spin 0.8s linear infinite' }}
              />
              <span className="text-sm text-cyan font-medium">处理中</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 rounded-full bg-text-3" />
              <span className="text-sm text-text-2">就绪</span>
            </>
          )}
        </div>
      </div>

      {/* Right: Settings */}
      <button
        onClick={onOpenSettings}
        className="relative flex items-center gap-2 px-3 py-2 rounded-lg text-text-2 hover:text-text-0 hover:bg-surface-2 cursor-pointer transition-colors"
      >
        <Settings size={15} />
        <span className="text-xs">API</span>
        {/* Status dot */}
        <span className={`w-1.5 h-1.5 rounded-full ${hasApiKey ? 'bg-emerald' : 'bg-rose'}`} />
      </button>
    </header>
  )
}
