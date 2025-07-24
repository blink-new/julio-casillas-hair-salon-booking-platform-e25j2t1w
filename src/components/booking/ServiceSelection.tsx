import { useState } from 'react'
import { Scissors, Palette, Sparkles, Clock, DollarSign } from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'

interface Service {
  id: string
  name: string
  description: string
  duration: number
  price: number
  category: string
  icon: any
}

interface ServiceSelectionProps {
  selectedService: Service | null
  onServiceSelect: (service: Service) => void
}

export default function ServiceSelection({ selectedService, onServiceSelect }: ServiceSelectionProps) {
  const services: Service[] = [
    {
      id: 'haircut-women',
      name: 'Women\'s Haircut',
      description: 'Precision cut with wash, style, and consultation',
      duration: 60,
      price: 85,
      category: 'Cut',
      icon: Scissors
    },
    {
      id: 'haircut-men',
      name: 'Men\'s Haircut',
      description: 'Classic or modern cut with wash and style',
      duration: 45,
      price: 65,
      category: 'Cut',
      icon: Scissors
    },
    {
      id: 'color-full',
      name: 'Full Color',
      description: 'Complete color transformation with toner and style',
      duration: 180,
      price: 150,
      category: 'Color',
      icon: Palette
    },
    {
      id: 'highlights',
      name: 'Highlights',
      description: 'Partial or full highlights with toner and style',
      duration: 150,
      price: 120,
      category: 'Color',
      icon: Palette
    },
    {
      id: 'color-touch-up',
      name: 'Color Touch-Up',
      description: 'Root touch-up and refresh existing color',
      duration: 90,
      price: 95,
      category: 'Color',
      icon: Palette
    },
    {
      id: 'blowout',
      name: 'Blowout & Style',
      description: 'Professional wash, blow dry, and styling',
      duration: 45,
      price: 45,
      category: 'Style',
      icon: Sparkles
    },
    {
      id: 'deep-treatment',
      name: 'Deep Conditioning Treatment',
      description: 'Intensive hair treatment for damaged or dry hair',
      duration: 60,
      price: 65,
      category: 'Treatment',
      icon: Sparkles
    },
    {
      id: 'keratin',
      name: 'Keratin Treatment',
      description: 'Smoothing treatment to reduce frizz and add shine',
      duration: 240,
      price: 300,
      category: 'Treatment',
      icon: Sparkles
    }
  ]

  const categories = ['All', 'Cut', 'Color', 'Style', 'Treatment']
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredServices = selectedCategory === 'All' 
    ? services 
    : services.filter(service => service.category === selectedCategory)

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
          const Icon = service.icon
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
                        <span>{service.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

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

