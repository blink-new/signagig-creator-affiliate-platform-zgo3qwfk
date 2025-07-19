import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { blink } from '@/blink/client'
import { CreatorProfile, AffiliateOffer } from '@/types'
import { 
  TrendingUp, 
  Search, 
  Filter,
  ExternalLink,
  DollarSign,
  Users,
  BarChart3,
  Star,
  Clock,
  Target,
  Zap,
  Bell,
  Settings,
  LogOut
} from 'lucide-react'

interface DashboardProps {
  user: any
}

// Real-time data fetching from database

export default function Dashboard({ user }: DashboardProps) {
  const [profile, setProfile] = useState<CreatorProfile | null>(null)
  const [offers, setOffers] = useState<AffiliateOffer[]>([])
  const [filteredOffers, setFilteredOffers] = useState<AffiliateOffer[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [platformFilter, setPlatformFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  const loadProfile = useCallback(async () => {
    try {
      const profiles = await blink.db.creatorProfiles.list({
        where: { userId: user.id },
        limit: 1
      })
      
      if (profiles.length > 0) {
        const rawProfile = profiles[0]
        // Helper function to safely parse array fields
        const parseArrayField = (field: any): string[] => {
          if (Array.isArray(field)) {
            return field.filter(item => typeof item === 'string' && item.trim())
          }
          
          if (typeof field === 'string' && field.trim()) {
            // Handle comma-separated strings (primary format)
            if (field.includes(',')) {
              return field.split(',').map(p => p.trim()).filter(p => p)
            }
            
            // Try to parse as JSON (fallback for legacy data)
            try {
              const parsed = JSON.parse(field)
              return Array.isArray(parsed) ? parsed.filter(item => typeof item === 'string' && item.trim()) : [field.trim()]
            } catch {
              // Single value
              return [field.trim()]
            }
          }
          
          return []
        }

        // Transform database data to match our interface
        const transformedProfile: CreatorProfile = {
          id: rawProfile.id,
          userId: rawProfile.userId,
          primaryNiche: rawProfile.primaryNiche || '',
          platforms: parseArrayField(rawProfile.platforms),
          country: rawProfile.country || '',
          audienceSize: rawProfile.audienceSize || '',
          affiliatePlatforms: parseArrayField(rawProfile.affiliatePlatforms),
          createdAt: rawProfile.createdAt,
          updatedAt: rawProfile.updatedAt
        }
        setProfile(transformedProfile)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    }
  }, [user.id])

  const loadOffers = useCallback(async () => {
    try {
      const offersData = await blink.db.affiliateOffers.list({
        orderBy: { createdAt: 'desc' },
        limit: 50
      })
      
      // Transform database data to match our interface
      const transformedOffers: AffiliateOffer[] = offersData.map(offer => ({
        id: offer.id,
        productName: offer.productName,
        category: offer.category,
        affiliatePlatform: offer.affiliatePlatform,
        commissionRate: offer.commissionRate,
        clicks: offer.clicks,
        conversions: offer.conversions,
        socialMentions: offer.socialMentions,
        trending: Number(offer.trending) > 0,
        description: offer.description,
        imageUrl: offer.imageUrl,
        affiliateUrl: offer.affiliateUrl,
        createdAt: offer.createdAt
      }))
      
      setOffers(transformedOffers)
      setFilteredOffers(transformedOffers)
    } catch (error) {
      console.error('Error loading offers:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const filterOffers = useCallback(() => {
    let filtered = offers

    if (searchQuery) {
      filtered = filtered.filter(offer =>
        offer.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(offer => offer.category === categoryFilter)
    }

    if (platformFilter !== 'all') {
      filtered = filtered.filter(offer => offer.affiliatePlatform === platformFilter)
    }

    setFilteredOffers(filtered)
  }, [offers, searchQuery, categoryFilter, platformFilter])

  useEffect(() => {
    loadProfile()
    loadOffers()
  }, [loadProfile, loadOffers])

  useEffect(() => {
    filterOffers()
  }, [filterOffers])

  const getMatchedOffers = () => {
    if (!profile) return offers
    
    return offers.filter(offer => 
      offer.category.toLowerCase().includes(profile.primaryNiche.toLowerCase()) ||
      profile.primaryNiche.toLowerCase().includes(offer.category.toLowerCase())
    )
  }

  const handleLogout = () => {
    blink.auth.logout()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const matchedOffers = getMatchedOffers()
  const categories = [...new Set(offers.map(offer => offer.category))]
  const platforms = [...new Set(offers.map(offer => offer.affiliatePlatform))]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">SignaGig</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user.email?.split('@')[0]}! 👋
          </h1>
          <p className="text-muted-foreground">
            {profile && profile.platforms && Array.isArray(profile.platforms) && profile.platforms.length > 0 
              ? `${profile.primaryNiche} creator on ${profile.platforms.join(', ')}`
              : profile 
              ? `${profile.primaryNiche} creator`
              : 'Welcome to SignaGig!'
            }
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Matched Offers</p>
                  <p className="text-2xl font-bold text-primary">{matchedOffers.length}</p>
                </div>
                <Target className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Trending Now</p>
                  <p className="text-2xl font-bold text-accent">{offers.filter(o => o.trending).length}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Commission</p>
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round(offers.reduce((acc, o) => acc + o.commissionRate, 0) / offers.length)}%
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Offers</p>
                  <p className="text-2xl font-bold text-blue-600">{offers.length}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="matched" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="matched">Smart Matches</TabsTrigger>
            <TabsTrigger value="trending">Trending Offers</TabsTrigger>
            <TabsTrigger value="brands">Brand Database</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Smart Matches Tab */}
          <TabsContent value="matched" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search offers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  {platforms.map(platform => (
                    <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOffers.map((offer) => (
                <Card key={offer.id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{offer.productName}</CardTitle>
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="secondary">{offer.category}</Badge>
                          <Badge variant="outline">{offer.affiliatePlatform}</Badge>
                          {offer.trending && (
                            <Badge className="bg-accent text-white">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Trending
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {offer.imageUrl && (
                      <img 
                        src={offer.imageUrl} 
                        alt={offer.productName}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    )}
                    
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {offer.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="font-medium">{offer.commissionRate}%</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span>{offer.socialMentions} mentions</span>
                      </div>
                      {offer.clicks && (
                        <div className="flex items-center space-x-1">
                          <BarChart3 className="w-4 h-4 text-purple-600" />
                          <span>{offer.clicks} clicks</span>
                        </div>
                      )}
                      {offer.conversions && (
                        <div className="flex items-center space-x-1">
                          <Target className="w-4 h-4 text-orange-600" />
                          <span>{offer.conversions} sales</span>
                        </div>
                      )}
                    </div>
                    
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Get Affiliate Link
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredOffers.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No offers found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}
          </TabsContent>

          {/* Trending Offers Tab */}
          <TabsContent value="trending">
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Trending Offers</h3>
              <p className="text-muted-foreground">Real-time trending offers coming soon!</p>
            </div>
          </TabsContent>

          {/* Brand Database Tab */}
          <TabsContent value="brands">
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Brand Database</h3>
              <p className="text-muted-foreground">Database of sponsoring brands coming soon!</p>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
              <p className="text-muted-foreground">Performance analytics coming soon!</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}