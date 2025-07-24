import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Clock, User, Scissors, CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Separator } from '../ui/separator'
import { Badge } from '../ui/badge'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { toast } from 'sonner'

interface BookingConfirmationProps {
  bookingData: any
}

export default function BookingConfirmation({ bookingData }: BookingConfirmationProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  const calculateEndTime = (startTime: string, durationMinutes: number) => {
    const [hours, minutes] = startTime.split(':').map(Number)
    const startDate = new Date()
    startDate.setHours(hours, minutes, 0, 0)
    
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000)
    
    return `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}:00`
  }

  const handleConfirmBooking = async () => {
    if (!user) {
      toast.error('Please sign in to book an appointment')
      navigate('/auth')
      return
    }

    setIsSubmitting(true)
    
    try {
      // First, ensure client record exists
      const { data: existingClient, error: clientCheckError } = await supabase
        .from('clients')
        .select('id')
        .eq('id', user.id)
        .single()

      if (clientCheckError && clientCheckError.code === 'PGRST116') {
        // Client doesn't exist, create one
        const { error: clientCreateError } = await supabase
          .from('clients')
          .insert({
            id: user.id,
            first_name: bookingData.clientInfo.firstName,
            last_name: bookingData.clientInfo.lastName,
            email: bookingData.clientInfo.email,
            phone: bookingData.clientInfo.phone,
            emergency_contact_name: bookingData.clientInfo.emergencyContact || null,
            emergency_contact_phone: bookingData.clientInfo.emergencyContactPhone || null
          })

        if (clientCreateError) {
          console.error('Error creating client:', clientCreateError)
          toast.error('Failed to create client profile')
          return
        }
      }

      // Create client intake record if it doesn't exist
      if (bookingData.intakeForm) {
        const { error: intakeError } = await supabase
          .from('client_intake')
          .upsert({
            client_id: user.id,
            hair_type: bookingData.intakeForm.hairType || null,
            hair_texture: bookingData.intakeForm.hairTexture || null,
            scalp_condition: bookingData.intakeForm.hairCondition || null,
            previous_chemical_services: bookingData.intakeForm.previousTreatments || null,
            current_medications: bookingData.intakeForm.medications || null,
            allergies: bookingData.intakeForm.allergies?.join(', ') || null,
            skin_sensitivities: bookingData.intakeForm.scalpSensitivity || null,
            hair_goals: bookingData.intakeForm.hairGoals || null,
            lifestyle_factors: bookingData.intakeForm.lifestyle || null,
            preferred_styling_time: bookingData.intakeForm.stylingTime || null,
            heat_tool_usage: bookingData.intakeForm.heatTools || null,
            product_preferences: bookingData.intakeForm.productPreferences || null,
            budget_range: bookingData.intakeForm.budget || null,
            referral_source: bookingData.intakeForm.referralSource || null,
            additional_notes: bookingData.intakeForm.specialRequests || null
          })

        if (intakeError) {
          console.error('Error saving intake form:', intakeError)
          // Don't fail the booking for intake form errors
        }
      }

      // Create the appointment
      const appointmentDate = bookingData.dateTime.date.toISOString().split('T')[0]
      const startTime = bookingData.dateTime.time
      const endTime = calculateEndTime(startTime, bookingData.service.duration)

      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .insert({
          client_id: user.id,
          staff_id: bookingData.staff.id === 'any' ? null : bookingData.staff.id,
          service_id: bookingData.service.id,
          appointment_date: appointmentDate,
          start_time: startTime,
          end_time: endTime,
          status: 'scheduled',
          total_price: bookingData.service.price,
          notes: bookingData.intakeForm?.specialRequests || null
        })
        .select()
        .single()

      if (appointmentError) {
        console.error('Error creating appointment:', appointmentError)
        toast.error('Failed to book appointment. Please try again.')
        return
      }

      // Create appointment service record
      const { error: serviceError } = await supabase
        .from('appointment_services')
        .insert({
          appointment_id: appointment.id,
          service_id: bookingData.service.id,
          price: bookingData.service.price
        })

      if (serviceError) {
        console.error('Error creating appointment service:', serviceError)
        // Don't fail the booking for this
      }

      setIsConfirmed(true)
      toast.success('Appointment booked successfully!')
      
    } catch (error) {
      console.error('Booking error:', error)
      toast.error('Failed to book appointment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isConfirmed) {
    return (
      <div className="text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Appointment Confirmed!
          </h2>
          <p className="text-muted-foreground">
            Your appointment has been successfully booked. You will receive a confirmation email shortly.
          </p>
        </div>

        <Card className="text-left">
          <CardHeader>
            <CardTitle>Appointment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span>{bookingData.dateTime.formatted}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Scissors className="h-5 w-5 text-muted-foreground" />
              <span>{bookingData.service.name}</span>
            </div>
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <span>{bookingData.staff.name}</span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2">
          <Button onClick={() => navigate('/portal')} className="w-full">
            View My Appointments
          </Button>
          <Button variant="outline" onClick={() => navigate('/')} className="w-full">
            Return to Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Review Your Appointment
        </h2>
        <p className="text-muted-foreground">
          Please review all details before confirming your booking
        </p>
      </div>

      {/* Appointment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Appointment Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Service Details */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Scissors className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{bookingData.service.name}</p>
                <p className="text-sm text-muted-foreground">{bookingData.service.description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">${bookingData.service.price}</p>
              <p className="text-sm text-muted-foreground">{bookingData.service.duration} min</p>
            </div>
          </div>

          <Separator />

          {/* Staff Details */}
          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">{bookingData.staff.name}</p>
              {bookingData.staff.email && (
                <p className="text-sm text-muted-foreground">{bookingData.staff.email}</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Date & Time */}
          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">{bookingData.dateTime.formatted}</p>
              <p className="text-sm text-muted-foreground">
                Duration: {bookingData.service.duration} minutes
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Client Information */}
      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">
                {bookingData.clientInfo.firstName} {bookingData.clientInfo.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{bookingData.clientInfo.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{bookingData.clientInfo.phone}</p>
            </div>
            {bookingData.clientInfo.emergencyContact && (
              <div>
                <p className="text-sm text-muted-foreground">Emergency Contact</p>
                <p className="font-medium">{bookingData.clientInfo.emergencyContact}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Hair Information Summary */}
      {bookingData.intakeForm && (
        <Card>
          <CardHeader>
            <CardTitle>Hair Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookingData.intakeForm.hairType && (
                <div>
                  <p className="text-sm text-muted-foreground">Hair Type</p>
                  <Badge variant="secondary">{bookingData.intakeForm.hairType}</Badge>
                </div>
              )}
              {bookingData.intakeForm.hairTexture && (
                <div>
                  <p className="text-sm text-muted-foreground">Hair Texture</p>
                  <Badge variant="secondary">{bookingData.intakeForm.hairTexture}</Badge>
                </div>
              )}
              {bookingData.intakeForm.hairCondition && (
                <div>
                  <p className="text-sm text-muted-foreground">Hair Condition</p>
                  <Badge variant="secondary">{bookingData.intakeForm.hairCondition}</Badge>
                </div>
              )}
              {bookingData.intakeForm.scalpSensitivity && (
                <div>
                  <p className="text-sm text-muted-foreground">Scalp Sensitivity</p>
                  <Badge variant="secondary">{bookingData.intakeForm.scalpSensitivity}</Badge>
                </div>
              )}
            </div>

            {bookingData.intakeForm.allergies && bookingData.intakeForm.allergies.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Allergies</p>
                <div className="flex flex-wrap gap-1">
                  {bookingData.intakeForm.allergies.map((allergy: string, index: number) => (
                    <Badge key={index} variant="destructive" className="text-xs">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {bookingData.intakeForm.specialRequests && (
              <div>
                <p className="text-sm text-muted-foreground">Special Requests</p>
                <p className="text-sm">{bookingData.intakeForm.specialRequests}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Total Cost */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between text-lg font-semibold">
            <span>Total Cost</span>
            <span>${bookingData.service.price}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Payment will be processed at the salon
          </p>
        </CardContent>
      </Card>

      {/* Confirmation Button */}
      <Button 
        onClick={handleConfirmBooking}
        disabled={isSubmitting}
        className="w-full"
        size="lg"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Confirming Appointment...
          </>
        ) : (
          'Confirm Appointment'
        )}
      </Button>

      {/* Terms */}
      <div className="text-center text-xs text-muted-foreground">
        <p>
          By confirming this appointment, you agree to our{' '}
          <a href="#" className="underline">terms of service</a> and{' '}
          <a href="#" className="underline">cancellation policy</a>.
        </p>
      </div>
    </div>
  )
}