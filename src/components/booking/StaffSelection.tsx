import { useState, useEffect } from 'react'
import { Star, Award, Clock } from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { supabase, Staff } from '../../lib/supabase'
import { toast } from 'sonner'

interface StaffSelectionProps {
  selectedStaff: Staff | null
  onStaffSelect: (staff: Staff) => void
  service: any
}

export default function StaffSelection({ selectedStaff, onStaffSelect, service }: StaffSelectionProps) {
  const [staff, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(true)

  const fetchStaff = async () => {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true })

      if (error) {
        toast.error('Failed to load staff')
        console.error('Error fetching staff:', error)
        return
      }

      setStaff(data || [])
    } catch (error) {
      toast.error('Failed to load staff')
      console.error('Error fetching staff:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStaff()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="h-4 w-64 bg-muted animate-pulse rounded mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-muted-foreground">
          Choose your preferred stylist for: <span className="font-semibold text-foreground">{service?.name}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {staff.map((member) => {
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
                    {member.image_url ? (
                      <img
                        src={member.image_url}
                        alt={member.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                        <span className="text-lg font-semibold text-secondary-foreground">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Staff Info */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-foreground">{member.name}</h3>
                        {member.email && (
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">5.0</span>
                      </div>
                    </div>

                    {member.bio && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {member.bio}
                      </p>
                    )}

                    {/* Phone */}
                    {member.phone && (
                      <div className="flex items-center space-x-1 mb-3">
                        <Award className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{member.phone}</span>
                      </div>
                    )}

                    {/* Specialties */}
                    {member.specialties && member.specialties.length > 0 && (
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
                    )}
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
        onClick={() => onStaffSelect({ 
          id: 'any', 
          name: 'Any Available Stylist',
          email: null,
          phone: null,
          bio: null,
          specialties: null,
          image_url: null,
          is_active: true,
          created_at: '',
          updated_at: ''
        } as Staff)}
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
              {selectedStaff.email && (
                <p className="text-sm text-muted-foreground">{selectedStaff.email}</p>
              )}
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">5.0</span>
            </div>
          </div>
        </div>
      )}

      {staff.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No staff members available at this time.</p>
        </div>
      )}
    </div>
  )
}