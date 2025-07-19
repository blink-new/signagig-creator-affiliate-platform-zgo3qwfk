export interface CreatorProfile {
  id: string
  userId: string
  primaryNiche: string
  platforms: string[]
  country: string
  audienceSize: string
  affiliatePlatforms: string[]
  createdAt: string
  updatedAt: string
}

export interface AffiliateOffer {
  id: string
  productName: string
  category: string
  affiliatePlatform: string
  commissionRate: number
  clicks?: number
  conversions?: number
  socialMentions: number
  trending: boolean
  description: string
  imageUrl?: string
  affiliateUrl: string
  createdAt: string
}

export interface BrandSponsorship {
  id: string
  brandName: string
  category: string
  budgetLevel: '$' | '$$' | '$$$'
  platforms: string[]
  sponsorshipType: string
  exampleCreator: string
  recentCampaign: string
  contactInfo?: string
  createdAt: string
}

export interface SocialTrend {
  id: string
  productName: string
  platform: 'TikTok' | 'YouTube' | 'Instagram'
  influencerName: string
  videoUrl: string
  likes: number
  shares: number
  comments: number
  engagementRate: number
  createdAt: string
}

export interface CustomOffer {
  id: string
  userId: string
  productName: string
  link: string
  commissionOffered: number
  campaignStart: string
  campaignEnd: string
  notes?: string
  status: 'active' | 'paused' | 'ended'
  createdAt: string
}