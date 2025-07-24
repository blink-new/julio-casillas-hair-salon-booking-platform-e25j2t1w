import { useState, useEffect } from 'react'
import { Scissors, Palette, Sparkles, Clock, DollarSign, Heart } from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { supabase, Service } from '../../lib/supabase'
import { toast } from 'sonner'

interface ServiceSelectionProps {
  selectedService: Service | null
  onServiceSelect: (service: Service) => void
}

export default function ServiceSelection({ selectedService, onServiceSelect }: ServiceSelectionProps) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true })
        .order('name', { ascending: true })

      if (error) {
        toast.error('Failed to load services')
        console.error('Error fetching services:', error)
        return
      }

      setServices(data || [])
    } catch (error) {
      toast.error('Failed to load services')
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const getServiceIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'cut':
        return Scissors
      case 'color':
        return Palette
      case 'style':
        return Sparkles
      case 'treatment':
        return Heart
      default:
        return Scissors
    }
  }

  const categories = ['All', ...Array.from(new Set(services.map(s => s.category)))]

  const filteredServices = selectedCategory === 'All' 
    ? services 
    : services.filter(service => service.category === selectedCategory)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 w-16 bg-muted animate-pulse rounded-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Badge
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            className="cursor-pointer px-4 py-2"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Badge>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredServices.map((service) => {
          const Icon = getServiceIcon(service.category)
          const isSelected = selectedService?.id === service.id

          return (
            <Card
              key={service.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                isSelected 
                  ? 'ring-2 ring-primary bg-primary/5' 
                  : 'hover:bg-accent/50'
              }`}
              onClick={() => onServiceSelect(service)}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${
                    isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-foreground">{service.name}</h3>
                      <Badge variant="secondary">{service.category}</Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {service.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{service.duration} min</span>
                      </div>
                      <div className="flex items-center space-x-1 font-semibold text-foreground">
                        <DollarSign className="h-4 w-4" />
                        <span>${service.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredServices.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No services found in this category.</p>
        </div>
      )}

      {selectedService && (
        <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
          <h4 className="font-semibold text-foreground mb-2">Selected Service:</h4>
          <div className="flex items-center justify-between">
            <span className="text-foreground">{selectedService.name}</span>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>{selectedService.duration} minutes</span>
              <span className="font-semibold text-foreground">${selectedService.price}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}