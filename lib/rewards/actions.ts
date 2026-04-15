'use server'

import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/auth/server'
import { grantDailySubscriptionPoints } from './queries'

export async function claimDailySubscriptionPointsAction() {
  const user = await requireAuth()
  await grantDailySubscriptionPoints(user.id)
  revalidatePath('/rewards')
}

