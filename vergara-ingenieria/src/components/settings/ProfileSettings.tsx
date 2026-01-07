'use client'

import { useEffect, useState } from 'react'
import { getUserProfile } from '@/app/actions/profile'
import { ProfileForm } from '@/components/ProfileForm'
import { Loader2 } from 'lucide-react'

export function ProfileSettings() {
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      const data = await getUserProfile()
      setProfile(data)
      setIsLoading(false)
    }
    loadProfile()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return <ProfileForm profile={profile} />
}
