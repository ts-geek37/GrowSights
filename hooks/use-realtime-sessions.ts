// hooks/use-realtime-sessions.ts
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Session } from '@/lib/types'

const LOOKBACK_DAYS = 30

export function useRealtimeSessions() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null

    const since = new Date()
    since.setDate(since.getDate() - LOOKBACK_DAYS)

    const fetchInitialData = async () => {
      try {
        setLoading(true)
        const { data, error: fetchError } = await supabase
          .from('sessions')
          .select('*')
          .in('status', ['in_progress', 'completed', 'abandoned'])
          .gte('created_at', since.toISOString())
          .order('updated_at', { ascending: false })

        if (fetchError) throw fetchError
        setSessions(data || [])
      } catch (err) {
        console.error('Error fetching sessions:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch sessions')
      } finally {
        setLoading(false)
      }
    }

    const setupRealtime = () => {
      channel = supabase
        .channel('sessions-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'sessions',
          },
          (payload) => {
            setSessions((prev) => {
              if (payload.eventType === 'DELETE') {
                return prev.filter(s => s.id !== (payload.old as Session).id)
              } else if (payload.eventType === 'INSERT') {
                const newSession = payload.new as Session
                // only add if within lookback window
                if (new Date(newSession.created_at) < since) return prev
                return [newSession, ...prev]
              } else if (payload.eventType === 'UPDATE') {
                return prev.map(s =>
                  s.id === (payload.new as Session).id
                    ? (payload.new as Session)
                    : s
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

  return { sessions, loading, error }
}