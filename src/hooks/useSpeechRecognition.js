import { useState, useRef, useCallback, useEffect } from 'react'

const SpeechRecognition = typeof window !== 'undefined'
  ? window.SpeechRecognition || window.webkitSpeechRecognition
  : null

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimText, setInterimText] = useState('')
  const recognitionRef = useRef(null)
  const isListeningRef = useRef(false)

  const isSupported = !!SpeechRecognition

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [])

  const startListening = useCallback(() => {
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'zh-CN'

    recognition.onresult = (event) => {
      let finalText = ''
      let interim = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalText += result[0].transcript
        } else {
          interim += result[0].transcript
        }
      }

      if (finalText) {
        setTranscript(prev => prev + finalText)
      }
      setInterimText(interim)
    }

    recognition.onend = () => {
      if (isListeningRef.current) {
        recognition.start()
      }
    }

    recognition.onerror = (event) => {
      if (event.error === 'no-speech' || event.error === 'aborted') return
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
      isListeningRef.current = false
    }

    recognitionRef.current = recognition
    isListeningRef.current = true
    setIsListening(true)
    setInterimText('')
    recognition.start()
  }, [])

  const stopListening = useCallback(() => {
    isListeningRef.current = false
    setIsListening(false)
    setInterimText('')
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
  }, [])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    setInterimText('')
  }, [])

  return {
    isSupported,
    isListening,
    transcript,
    setTranscript,
    interimText,
    startListening,
    stopListening,
    resetTranscript,
  }
}
