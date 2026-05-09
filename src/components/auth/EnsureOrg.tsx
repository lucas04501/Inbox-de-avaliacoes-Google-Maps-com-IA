'use client'

import { useEffect } from 'react'

export function EnsureOrg() {
  useEffect(() => {
    fetch('/api/auth/ensure-org')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'created') {
          window.location.reload()
        }
      })
      .catch(err => console.error('Error ensuring org:', err))
  }, [])

  return null
}
