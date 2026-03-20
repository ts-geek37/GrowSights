export interface Database {
  public: {
    Tables: {
      industries: {
        Row: {
          id: string
          slug: string
          display_name: string
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          display_name: string
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          display_name?: string
          created_at?: string
        }
      }
      benchmark_aggregates: {
        Row: {
          id: string
          industry: string
          turnover_band: string
          location_band: string
          hq_tier: string
          team_size: string
          metric_name: string
          avg_value: number
          unit: string
          top20_value: number
          insight_text: string
          opportunity_text: string
          created_at: string
        }
        Insert: {
          id?: string
          industry: string
          turnover_band: string
          location_band: string
          hq_tier: string
          team_size: string
          metric_name: string
          avg_value: number
          unit: string
          top20_value: number
          insight_text: string
          opportunity_text: string
          created_at?: string
        }
        Update: {
          id?: string
          industry?: string
          turnover_band?: string
          location_band?: string
          hq_tier?: string
          team_size?: string
          metric_name?: string
          avg_value?: number
          unit?: string
          top20_value?: number
          insight_text?: string
          opportunity_text?: string
          created_at?: string
        }
      }
      insights: {
        Row: {
          id: string
          industry: string
          turnover_band: string
          location_band: string
          hq_tier: string
          team_size: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          industry: string
          turnover_band: string
          location_band: string
          hq_tier: string
          team_size: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          industry?: string
          turnover_band?: string
          location_band?: string
          hq_tier?: string
          team_size?: string
          content?: string
          created_at?: string
        }
      }
      sessions: {
        Row: {
          id: string
          call_sid: string
          caller_number: string
          status: 'in_progress' | 'completed' | 'abandoned'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          call_sid: string
          caller_number: string
          status: 'in_progress' | 'completed' | 'abandoned'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          call_sid?: string
          caller_number?: string
          status?: 'in_progress' | 'completed' | 'abandoned'
          created_at?: string
          updated_at?: string
        }
      }
      answers: {
        Row: {
          id: string
          session_id: string
          question: string
          answer: string
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          question: string
          answer: string
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          question?: string
          answer?: string
          created_at?: string
        }
      }
      benchmark_results: {
        Row: {
          id: string
          session_id: string
          caller_name: string
          industry: string
          turnover_band: string
          location_band: string
          hq_tier: string
          team_size: string
          finding_1: string
          finding_2: string
          finding_3: string
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          caller_name: string
          industry: string
          turnover_band: string
          location_band: string
          hq_tier: string
          team_size: string
          finding_1: string
          finding_2: string
          finding_3: string
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          caller_name?: string
          industry?: string
          turnover_band?: string
          location_band?: string
          hq_tier?: string
          team_size?: string
          finding_1?: string
          finding_2?: string
          finding_3?: string
          created_at?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}

export type Industry = Database['public']['Tables']['industries']['Row']
export type BenchmarkAggregate = Database['public']['Tables']['benchmark_aggregates']['Row']
export type Insight = Database['public']['Tables']['insights']['Row']
export type Session = Database['public']['Tables']['sessions']['Row']
export type Answer = Database['public']['Tables']['answers']['Row']
export type BenchmarkResult = Database['public']['Tables']['benchmark_results']['Row']
