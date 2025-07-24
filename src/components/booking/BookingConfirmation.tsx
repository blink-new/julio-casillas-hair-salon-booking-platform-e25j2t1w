import { useState } from 'react'
import { Calendar, Clock, User, Scissors, CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Separator } from '../ui/separator'
import { Badge } from '../ui/badge'
import { blink } from '../../blink/client'
import { toast } from 'sonner'

interface BookingConfirmationProps {
  bookingData: any
}

export default function BookingConfirmation({ bookingData }: BookingConfirmationProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)

  const handleConfirmBooking = async () => {
    setIsSubmitting(true)
    
    try {
      // Create the booking record in the database
      const booking = await blink.db.bookings.create({
        serviceId: bookingData.service.id,
        serviceName: bookingData.service.name,
        servicePrice: bookingData.service.price,
        serviceDuration: bookingData.service.duration,
        staffId: bookingData.staff.id,
        staffName: bookingData.staff.name,
        appointmentDate: bookingData.dateTime.date.toISOString(),
        appointmentTime: bookingData.dateTime.time,
        clientFirstName: bookingData.clientInfo.firstName,
        clientLastName: bookingData.clientInfo.lastName,
        clientEmail: bookingData.clientInfo.email,
        clientPhone: bookingData.clientInfo.phone,
        emergencyContact: bookingData.clientInfo.emergencyContact || '',
        hairHistory: JSON.stringify(bookingData.intakeForm),
        status: 'confirmed',
        createdAt: new Date().toISOString()
      })

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
          <Button asChild className="w-full">
            <a href="/portal">View My Appointments</a>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <a href="/">Return to Home</a>
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
              {bookingData.staff.title && (
                <p className="text-sm text-muted-foreground">{bookingData.staff.title}</p>
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