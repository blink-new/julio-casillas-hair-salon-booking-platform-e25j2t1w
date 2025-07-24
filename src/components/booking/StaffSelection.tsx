import { Star, Award, Clock } from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'

interface Staff {
  id: string
  name: string
  title: string
  bio: string
  specialties: string[]
  experience: string
  rating: number
  image: string
  available: boolean
}

interface StaffSelectionProps {
  selectedStaff: Staff | null
  onStaffSelect: (staff: Staff) => void
  service: any
}

export default function StaffSelection({ selectedStaff, onStaffSelect, service }: StaffSelectionProps) {
  const staff: Staff[] = [
    {
      id: 'julio-casillas',
      name: 'Julio Casillas',
      title: 'Master Stylist & Owner',
      bio: 'With over 15 years of experience, Julio specializes in precision cuts and advanced color techniques. He has trained with top stylists in New York and Paris.',
      specialties: ['Precision Cuts', 'Color Correction', 'Balayage', 'Keratin Treatments'],
      experience: '15+ years',
      rating: 5.0,
      image: '/api/placeholder/150/150',
      available: true
    },
    {
      id: 'maria-santos',
      name: 'Maria Santos',
      title: 'Senior Colorist',
      bio: 'Maria is our color specialist with a passion for creating stunning transformations. She excels in highlights, balayage, and creative color work.',
      specialties: ['Highlights', 'Balayage', 'Creative Color', 'Color Correction'],
      experience: '8+ years',
      rating: 4.9,
      image: '/api/placeholder/150/150',
      available: true
    },
    {
      id: 'david-kim',
      name: 'David Kim',
      title: 'Style Director',
      bio: 'David brings modern techniques and classic styling expertise. He specializes in men\'s cuts and contemporary women\'s styles.',
      specialties: ['Men\'s Cuts', 'Modern Styling', 'Beard Trimming', 'Wedding Styles'],
      experience: '10+ years',
      rating: 4.8,
      image: '/api/placeholder/150/150',
      available: true
    },
    {
      id: 'sofia-rodriguez',
      name: 'Sofia Rodriguez',
      title: 'Treatment Specialist',
      bio: 'Sofia focuses on hair health and restoration. She is certified in various treatment techniques and specializes in damaged hair recovery.',
      specialties: ['Deep Treatments', 'Keratin', 'Hair Restoration', 'Scalp Care'],
      experience: '6+ years',
      rating: 4.9,
      image: '/api/placeholder/150/150',
      available: false
    }
  ]

  const availableStaff = staff.filter(member => member.available)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-muted-foreground">
          Choose your preferred stylist for: <span className="font-semibold text-foreground">{service?.name}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {availableStaff.map((member) => {
          const isSelected = selectedStaff?.id === member.id

          return (
            <Card
              key={member.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                isSelected 
                  ? 'ring-2 ring-primary bg-primary/5' 
                  : 'hover:bg-accent/50'
              }`}
              onClick={() => onStaffSelect(member)}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Profile Image */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                      <span className="text-lg font-semibold text-secondary-foreground">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  </div>

                  {/* Staff Info */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-foreground">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">{member.title}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{member.rating}</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {member.bio}
                    </p>

                    {/* Experience */}
                    <div className="flex items-center space-x-1 mb-3">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{member.experience} experience</span>
                    </div>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-1">
                      {member.specialties.slice(0, 3).map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                      {member.specialties.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{member.specialties.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Any Staff Option */}
      <Card
        className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
          selectedStaff?.id === 'any' 
            ? 'ring-2 ring-primary bg-primary/5' 
            : 'hover:bg-accent/50'
        }`}
        onClick={() => onStaffSelect({ id: 'any', name: 'Any Available Stylist' } as Staff)}
      >
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Any Available Stylist</h3>
              <p className="text-sm text-muted-foreground">
                Let us assign the best available stylist for your service
              </p>
              <Badge variant="outline" className="mt-2">
                Flexible Scheduling
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedStaff && selectedStaff.id !== 'any' && (
        <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
          <h4 className="font-semibold text-foreground mb-2">Selected Stylist:</h4>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-foreground font-medium">{selectedStaff.name}</span>
              <p className="text-sm text-muted-foreground">{selectedStaff.title}</p>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{selectedStaff.rating}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}