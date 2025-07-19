import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { blink } from '@/blink/client'
import { 
  TrendingUp, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  Users,
  Globe,
  DollarSign
} from 'lucide-react'

interface CreatorOnboardingProps {
  onComplete: () => void
}

const NICHES = [
  'Fashion & Style', 'Beauty & Skincare', 'Fitness & Health', 'Technology', 
  'Gaming', 'Food & Cooking', 'Travel', 'Lifestyle', 'Business & Finance',
  'Education', 'Entertainment', 'Home & Garden', 'Parenting', 'Sports'
]

const PLATFORMS = [
  { name: 'Instagram', icon: '📷' },
  { name: 'TikTok', icon: '🎵' },
  { name: 'YouTube', icon: '📺' },
  { name: 'Twitter/X', icon: '🐦' },
  { name: 'LinkedIn', icon: '💼' },
  { name: 'Pinterest', icon: '📌' },
  { name: 'Snapchat', icon: '👻' },
  { name: 'Twitch', icon: '🎮' }
]

const COUNTRIES = [
  'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany',
  'France', 'Spain', 'Italy', 'Netherlands', 'Brazil', 'Mexico',
  'India', 'Nigeria', 'South Africa', 'Other'
]

const AUDIENCE_SIZES = [
  '< 1K followers', '1K - 10K followers', '10K - 50K followers',
  '50K - 100K followers', '100K - 500K followers', '500K - 1M followers',
  '1M+ followers'
]

const AFFILIATE_PLATFORMS = [
  'Amazon Associates', 'ClickBank', 'ShareASale', 'CJ Affiliate',
  'Impact', 'Digistore24', 'PartnerStack', 'Rakuten Advertising',
  'AvantLink', 'FlexOffers', 'None yet'
]

export default function CreatorOnboarding({ onComplete }: CreatorOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    primaryNiche: '',
    platforms: [] as string[],
    country: '',
    audienceSize: '',
    affiliatePlatforms: [] as string[]
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalSteps = 5
  const progress = (currentStep / totalSteps) * 100

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleNicheSelect = (niche: string) => {
    setFormData({ ...formData, primaryNiche: niche })
  }

  const handlePlatformToggle = (platform: string) => {
    const platforms = formData.platforms.includes(platform)
      ? formData.platforms.filter(p => p !== platform)
      : [...formData.platforms, platform]
    setFormData({ ...formData, platforms })
  }

  const handleCountrySelect = (country: string) => {
    setFormData({ ...formData, country })
  }

  const handleAudienceSizeSelect = (size: string) => {
    setFormData({ ...formData, audienceSize: size })
  }

  const handleAffiliatePlatformToggle = (platform: string) => {
    const affiliatePlatforms = formData.affiliatePlatforms.includes(platform)
      ? formData.affiliatePlatforms.filter(p => p !== platform)
      : [...formData.affiliatePlatforms, platform]
    setFormData({ ...formData, affiliatePlatforms })
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const user = await blink.auth.me()
      
      await blink.db.creatorProfiles.create({
        userId: user.id,
        primaryNiche: formData.primaryNiche,
        platforms: formData.platforms.join(','),
        country: formData.country,
        audienceSize: formData.audienceSize,
        affiliatePlatforms: formData.affiliatePlatforms.join(','),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })

      onComplete()
    } catch (error) {
      console.error('Error creating profile:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.primaryNiche !== ''
      case 2: return formData.platforms.length > 0
      case 3: return formData.country !== ''
      case 4: return formData.audienceSize !== ''
      case 5: return formData.affiliatePlatforms.length > 0
      default: return false
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">SignaGig</span>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              Step {currentStep} of {totalSteps}
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Profile Setup</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold">
              {currentStep === 1 && "What's your primary niche?"}
              {currentStep === 2 && "Which platforms do you create on?"}
              {currentStep === 3 && "Where are you located?"}
              {currentStep === 4 && "What's your audience size?"}
              {currentStep === 5 && "Which affiliate platforms do you use?"}
            </CardTitle>
            <p className="text-muted-foreground">
              {currentStep === 1 && "This helps us match you with relevant affiliate offers"}
              {currentStep === 2 && "We'll prioritize offers that work best on your platforms"}
              {currentStep === 3 && "Some offers are region-specific"}
              {currentStep === 4 && "This helps us find offers suitable for your reach"}
              {currentStep === 5 && "We can generate links for platforms you're already on"}
            </p>
          </CardHeader>

          <CardContent className="pb-8">
            {/* Step 1: Niche Selection */}
            {currentStep === 1 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {NICHES.map((niche) => (
                  <Button
                    key={niche}
                    variant={formData.primaryNiche === niche ? "default" : "outline"}
                    className={`h-auto p-4 text-left justify-start ${
                      formData.primaryNiche === niche 
                        ? "bg-primary text-white" 
                        : "hover:bg-primary/5"
                    }`}
                    onClick={() => handleNicheSelect(niche)}
                  >
                    <div className="flex items-center space-x-2">
                      {formData.primaryNiche === niche && (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium">{niche}</span>
                    </div>
                  </Button>
                ))}
              </div>
            )}

            {/* Step 2: Platform Selection */}
            {currentStep === 2 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {PLATFORMS.map((platform) => (
                  <Button
                    key={platform.name}
                    variant={formData.platforms.includes(platform.name) ? "default" : "outline"}
                    className={`h-auto p-4 text-center ${
                      formData.platforms.includes(platform.name)
                        ? "bg-primary text-white"
                        : "hover:bg-primary/5"
                    }`}
                    onClick={() => handlePlatformToggle(platform.name)}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <span className="text-2xl">{platform.icon}</span>
                      <span className="text-sm font-medium">{platform.name}</span>
                      {formData.platforms.includes(platform.name) && (
                        <CheckCircle className="w-4 h-4" />
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            )}

            {/* Step 3: Country Selection */}
            {currentStep === 3 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {COUNTRIES.map((country) => (
                  <Button
                    key={country}
                    variant={formData.country === country ? "default" : "outline"}
                    className={`h-auto p-4 text-left justify-start ${
                      formData.country === country
                        ? "bg-primary text-white"
                        : "hover:bg-primary/5"
                    }`}
                    onClick={() => handleCountrySelect(country)}
                  >
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4" />
                      {formData.country === country && (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium">{country}</span>
                    </div>
                  </Button>
                ))}
              </div>
            )}

            {/* Step 4: Audience Size */}
            {currentStep === 4 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {AUDIENCE_SIZES.map((size) => (
                  <Button
                    key={size}
                    variant={formData.audienceSize === size ? "default" : "outline"}
                    className={`h-auto p-4 text-left justify-start ${
                      formData.audienceSize === size
                        ? "bg-primary text-white"
                        : "hover:bg-primary/5"
                    }`}
                    onClick={() => handleAudienceSizeSelect(size)}
                  >
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      {formData.audienceSize === size && (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium">{size}</span>
                    </div>
                  </Button>
                ))}
              </div>
            )}

            {/* Step 5: Affiliate Platforms */}
            {currentStep === 5 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {AFFILIATE_PLATFORMS.map((platform) => (
                  <Button
                    key={platform}
                    variant={formData.affiliatePlatforms.includes(platform) ? "default" : "outline"}
                    className={`h-auto p-4 text-left justify-start ${
                      formData.affiliatePlatforms.includes(platform)
                        ? "bg-primary text-white"
                        : "hover:bg-primary/5"
                    }`}
                    onClick={() => handleAffiliatePlatformToggle(platform)}
                  >
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4" />
                      {formData.affiliatePlatforms.includes(platform) && (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium">{platform}</span>
                    </div>
                  </Button>
                ))}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="flex items-center space-x-2 bg-primary hover:bg-primary/90"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceed() || isSubmitting}
                  className="flex items-center space-x-2 bg-primary hover:bg-primary/90"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Creating Profile...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Setup</span>
                      <CheckCircle className="w-4 h-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}