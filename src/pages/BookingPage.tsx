import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Progress } from '../components/ui/progress'

// Booking Steps Components
import ServiceSelection from '../components/booking/ServiceSelection'
import StaffSelection from '../components/booking/StaffSelection'
import DateTimeSelection from '../components/booking/DateTimeSelection'
import ClientIntakeForm from '../components/booking/ClientIntakeForm'
import BookingConfirmation from '../components/booking/BookingConfirmation'

export interface BookingData {
  service: any
  staff: any
  dateTime: any
  clientInfo: any
  intakeForm: any
}

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [bookingData, setBookingData] = useState<BookingData>({
    service: null,
    staff: null,
    dateTime: null,
    clientInfo: null,
    intakeForm: null
  })

  const steps = [
    { id: 1, name: 'Service', description: 'Choose your service' },
    { id: 2, name: 'Stylist', description: 'Select your stylist' },
    { id: 3, name: 'Date & Time', description: 'Pick your appointment' },
    { id: 4, name: 'Details', description: 'Your information' },
    { id: 5, name: 'Confirmation', description: 'Review & confirm' }
  ]

  const updateBookingData = (stepData: any) => {
    setBookingData(prev => ({ ...prev, ...stepData }))
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: return bookingData.service !== null
      case 2: return bookingData.staff !== null
      case 3: return bookingData.dateTime !== null
      case 4: return bookingData.clientInfo !== null && bookingData.intakeForm !== null
      default: return true
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ServiceSelection
            selectedService={bookingData.service}
            onServiceSelect={(service) => updateBookingData({ service })}
          />
        )
      case 2:
        return (
          <StaffSelection
            selectedStaff={bookingData.staff}
            onStaffSelect={(staff) => updateBookingData({ staff })}
            service={bookingData.service}
          />
        )
      case 3:
        return (
          <DateTimeSelection
            selectedDateTime={bookingData.dateTime}
            onDateTimeSelect={(dateTime) => updateBookingData({ dateTime })}
            staff={bookingData.staff}
            service={bookingData.service}
          />
        )
      case 4:
        return (
          <ClientIntakeForm
            clientInfo={bookingData.clientInfo}
            intakeForm={bookingData.intakeForm}
            onClientInfoChange={(clientInfo) => updateBookingData({ clientInfo })}
            onIntakeFormChange={(intakeForm) => updateBookingData({ intakeForm })}
          />
        )
      case 5:
        return (
          <BookingConfirmation
            bookingData={bookingData}
          />
        )
      default:
        return null
    }
  }

  const progressPercentage = (currentStep / steps.length) * 100

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Book Your Appointment
          </h1>
          <p className="text-muted-foreground">
            Follow the steps below to schedule your visit with us
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progressPercentage} className="h-2 mb-4" />
          <div className="flex justify-between">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex flex-col items-center ${
                  step.id <= currentStep ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-2 ${
                    step.id < currentStep
                      ? 'bg-primary text-primary-foreground'
                      : step.id === currentStep
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step.id < currentStep ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    step.id
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">{step.name}</p>
                  <p className="text-xs hidden sm:block">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">
              Step {currentStep}: {steps[currentStep - 1].name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        {currentStep < 5 && (
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>

            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              className="flex items-center space-x-2"
            >
              <span>Next</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}