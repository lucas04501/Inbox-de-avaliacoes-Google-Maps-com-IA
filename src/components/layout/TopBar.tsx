'use client'

import { signOut } from '@/app/(auth)/actions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LogOut, User } from 'lucide-react'

interface TopBarProps {
  userName: string
  orgName: string
  plan: string
}

export function TopBar({ userName, orgName, plan }: TopBarProps) {
  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
      <div className="flex flex-col">
        <h2 className="text-sm font-semibold text-gray-900 line-clamp-1">{orgName}</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{userName}</span>
          <Badge variant="secondary" className="text-[10px] py-0 px-1 uppercase font-bold">
            {plan}
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-gray-500 hover:text-red-600 gap-2"
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sair</span>
        </Button>
      </div>
    </header>
  )
}
