'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface NavigationCardProps {
  title: string
  description: string
  href: string
  icon: React.ReactNode
}

export function NavigationCard({ title, description, href, icon }: NavigationCardProps) {
  return (
    <Link href={href}>
      <div className="group relative h-full rounded-lg border border-border/50 bg-card p-8 transition-all duration-300 hover:border-accent/70 hover:shadow-lg hover:shadow-accent/10 hover:-translate-y-1 cursor-pointer">
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-accent/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        <div className="relative z-10 flex flex-col h-full">
          <div className="mb-4 text-4xl text-accent">
            {icon}
          </div>
          
          <h3 className="text-xl font-semibold text-foreground mb-3">
            {title}
          </h3>
          
          <p className="text-muted-foreground mb-6 flex-grow text-sm leading-relaxed">
            {description}
          </p>
          
          <div className="flex items-center gap-2 text-accent font-medium text-sm">
            Explore
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  )
}
