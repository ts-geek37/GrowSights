'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Volume2 } from 'lucide-react'

const TTS_MODELS = [
  { id: 'elevenlabs-en-us', label: 'ElevenLabs (US)' },
  { id: 'google-en-us', label: 'Google Cloud (US)' },
  { id: 'aws-en-us', label: 'Amazon Polly (US)' },
  { id: 'azure-en-us', label: 'Microsoft Azure (US)' },
]

export function TTSSelector() {
  const [selected, setSelected] = useState<string>('elevenlabs-en-us')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem('alphagrowth-tts-model')
    if (saved) {
      setSelected(saved)
    }
    setMounted(true)
  }, [])

  const handleSelect = (modelId: string) => {
    setSelected(modelId)
    localStorage.setItem('alphagrowth-tts-model', modelId)
  }

  const selectedLabel = TTS_MODELS.find(m => m.id === selected)?.label || 'Select TTS'

  if (!mounted) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-border/50 hover:border-accent/50 hover:bg-accent/5"
        >
          <Volume2 className="w-4 h-4" />
          {selectedLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {TTS_MODELS.map((model) => (
          <DropdownMenuItem
            key={model.id}
            onClick={() => handleSelect(model.id)}
            className={selected === model.id ? 'bg-accent/10' : ''}
          >
            {model.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
