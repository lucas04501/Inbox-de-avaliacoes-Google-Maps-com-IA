export type Plan = 'free' | 'starter' | 'pro'

export interface Organization {
  id: string
  user_id: string
  name: string
  plan: Plan
  stripe_customer_id?: string
  stripe_subscription_id?: string
  created_at: string
}

export interface Location {
  id: string
  org_id: string
  google_place_id: string
  name: string
  address?: string
  google_account_id?: string
  last_synced_at?: string
  created_at: string
}

export type ReviewStatus = 'pending' | 'replied' | 'ignored'

export interface Review {
  id: string
  location_id: string
  google_review_id: string
  author_name?: string
  author_photo_url?: string
  rating: number // between 1 and 5
  text?: string
  published_at: string
  reply_text?: string
  replied_at?: string
  status: ReviewStatus
  ai_suggestion?: string
  created_at: string
}
