import { useState, useEffect } from 'react'
import Header from './components/Header'
import TranscriptPanel from './components/TranscriptPanel'
import PromptPanel from './components/PromptPanel'
import ApiKeyModal from './components/ApiKeyModal'
import { useSpeechRecognition } from './hooks/useSpeechRecognition'
import { generatePrompt } from './utils/generatePrompt'
import { optimizeWithDeepSeek } from './utils/deepseekApi'

const API_KEY_STORAGE = 'voiceprompt-deepseek-key'

export default function App() {
  const {
    isSupported,
    isListening,
    transcript,
    setTranscript,
    interimText,
    startListening,
    stopListening,
  } = useSpeechRecognition()

  const [prompt, setPrompt] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(API_KEY_STORAGE) || '')
  const [showSettings, setShowSettings] = useState(false)

  const status = isListening ? 'recording' : isProcessing ? 'processing' : 'idle'

  const handleSaveApiKey = (key) => {
    setApiKey(key)
    if (key) {
      localStorage.setItem(API_KEY_STORAGE, key)
    } else {
      localStorage.removeItem(API_KEY_STORAGE)
    }
  }

  const handleToggleRecording = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const handleOptimize = async () => {
    if (!transcript.trim()) return
    setIsProcessing(true)
    setError('')

    if (apiKey) {
      // 有 API Key → 调用 DeepSeek
      try {
        const result = await optimizeWithDeepSeek(transcript, apiKey)
        setPrompt(result)
      } catch (err) {
        setError(err.message)
        // 失败时 fallback 到本地
        setPrompt(generatePrompt(transcript))
      }
    } else {
      // 无 API Key → 本地 mock
      await new Promise(resolve => setTimeout(resolve, 400))
      setPrompt(generatePrompt(transcript))
    }

    setIsProcessing(false)
  }

  const handleClear = () => {
    setTranscript('')
    setPrompt('')
    setError('')
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt)
  }

  if (!isSupported) {
    return (
      <div className="flex items-center justify-center h-screen bg-void noise-bg relative">
        <div className="relative z-10 text-center p-12 max-w-lg">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-rose/10 flex items-center justify-center">
            <span className="text-3xl">⚠</span>
          </div>
          <h1 className="text-2xl font-semibold text-rose mb-3">浏览器不支持语音识别</h1>
          <p className="text-text-1 text-sm leading-relaxed">
            请使用 Chrome、Edge 或其他支持 Web Speech API 的浏览器访问。
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-void noise-bg relative">
      <div className="relative z-10 flex flex-col h-full">
        <Header
          status={status}
          hasApiKey={!!apiKey}
          onToggleRecording={handleToggleRecording}
          onOpenSettings={() => setShowSettings(true)}
        />

        {/* Error toast */}
        {error && (
          <div className="mx-4 mb-0 px-4 py-2.5 rounded-xl bg-rose/10 border border-rose/20 text-rose text-xs animate-float-in flex items-center justify-between">
            <span>API 错误：{error}</span>
            <button onClick={() => setError('')} className="text-rose/60 hover:text-rose cursor-pointer ml-4">✕</button>
          </div>
        )}

        <div className="flex flex-1 overflow-hidden p-4 gap-4">
          <div className="w-1/2 flex flex-col rounded-2xl bg-surface-0 border border-border overflow-hidden">
            <TranscriptPanel
              transcript={transcript}
              interimText={interimText}
              isListening={isListening}
              onTranscriptChange={setTranscript}
              onClear={handleClear}
            />
          </div>

          <div className="w-1/2 flex flex-col rounded-2xl bg-surface-0 border border-border overflow-hidden">
            <PromptPanel
              prompt={prompt}
              isProcessing={isProcessing}
              hasTranscript={!!transcript.trim()}
              hasApiKey={!!apiKey}
              onOptimize={handleOptimize}
              onCopy={handleCopy}
            />
          </div>
        </div>
      </div>

      {/* API Key Modal */}
      {showSettings && (
        <ApiKeyModal
          apiKey={apiKey}
          onSave={handleSaveApiKey}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}
