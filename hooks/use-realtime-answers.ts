// hooks/use-realtime-answers.ts
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Answer } from '@/lib/types'

const LOOKBACK_DAYS = 30

export function useRealtimeAnswers() {
  const [answers, setAnswers] = useState<Answer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null

    const since = new Date()
    since.setDate(since.getDate() - LOOKBACK_DAYS)

    const fetchInitialData = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('answers')
          .select('*')
          .gte('created_at', since.toISOString())
          .order('created_at', { ascending: false })

        if (error) throw error
        setAnswers(data || [])
      } catch (err) {
        console.error('Error fetching answers:', err)
      } finally {
        setLoading(false)
      }
    }

    const setupRealtime = () => {
      channel = supabase
        .channel('answers-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'answers',
          },
          (payload) => {
            setAnswers((prev) => {
              if (payload.eventType === 'DELETE') {
                return prev.filter(a => a.id !== (payload.old as Answer).id)
              } else if (payload.eventType === 'INSERT') {
                const newAnswer = payload.new as Answer
                // only add if within lookback window
                if (new Date(newAnswer.created_at) < since) return prev
                return [newAnswer, ...prev]
              } else if (payload.eventType === 'UPDATE') {
                return prev.map(a =>
                  a.id === (payload.new as Answer).id
                    ? (payload.new as Answer)
                    : a
                )
              }
              return prev
            })
          }
        )
        .subscribe()
    }

    fetchInitialData()
    setupRealtime()

    return () => {
      if (channel) supabase.removeChannel(channel)
    }
  }, [])

  return { answers, loading }
}