'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  Inbox, 
  MapPin, 
  Settings, 
  Menu, 
  X, 
  Zap,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SidebarProps {
  plan: string
}

export function Sidebar({ plan }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { name: 'Inbox', href: '/dashboard', icon: Inbox },
    { name: 'Locais', href: '/dashboard/locations', icon: MapPin },
    { name: 'Configurações', href: '/dashboard/settings', icon: Settings },
  ]

  const NavContent = () => (
    <div className="flex flex-col h-full py-6">
      <div className="px-6 mb-8 flex items-center gap-2">
        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xl">R</span>
        </div>
        <span className="font-bold text-xl tracking-tight text-gray-900">ReputaçãoAI</span>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive 
                  ? "bg-primary text-white" 
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
              {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
            </Link>
          )
        })}
      </nav>

      <div className="px-4 mt-auto">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-primary fill-primary" />
            <span className="text-xs font-semibold text-gray-500 uppercase">Plano Atual</span>
          </div>
          <p className="text-sm font-bold text-gray-900 capitalize mb-3">{plan}</p>
          {plan === 'free' && (
            <Button size="sm" className="w-full text-xs py-1 h-8">
              Fazer upgrade
            </Button>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Toggle */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button variant="outline" size="icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r bg-white fixed inset-y-0 left-0">
        <NavContent />
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Mobile */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white transform transition-transform duration-300 ease-in-out md:hidden",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <NavContent />
      </aside>
    </>
  )
}
