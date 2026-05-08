'use client'

import { useState } from 'react'
import { Organization } from '@/types'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export function OrganizationSettings({ initialOrg }: { initialOrg: Organization | null }) {
  const [name, setName] = useState(initialOrg?.name || '')
  const [isUpdating, setIsUpdating] = useState(false)
  const supabase = createClient()

  const handleUpdate = async () => {
    if (!initialOrg || !name) return
    setIsUpdating(true)
    try {
      const { error } = await supabase
        .from('organizations')
        .update({ name })
        .eq('id', initialOrg.id)

      if (error) throw error
      toast.success('Organização atualizada.')
    } catch (error) {
      toast.error('Erro ao atualizar organização.')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil da Organização</CardTitle>
        <CardDescription>
          Como sua empresa aparece no sistema.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="orgName">Nome da Organização</Label>
          <Input 
            id="orgName" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleUpdate} disabled={isUpdating || !name}>
          {isUpdating ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </CardFooter>
    </Card>
  )
}
