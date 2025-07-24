import { useState } from 'react'
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'

interface DateTimeSelectionProps {
  selectedDateTime: any
  onDateTimeSelect: (dateTime: any) => void
  staff: any
  service: any
}

export default function DateTimeSelection({ 
  selectedDateTime, 
  onDateTimeSelect, 
  staff, 
  service 
}: DateTimeSelectionProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      
      const isCurrentMonth = date.getMonth() === month
      const isPast = date < today
      const isToday = date.getTime() === today.getTime()
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString()

      days.push({
        date,
        isCurrentMonth,
        isPast,
        isToday,
        isSelected,
        isAvailable: isCurrentMonth && !isPast
      })
    }

    return days
  }

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = []
    const startHour = 9
    const endHour = 19
    const interval = 30

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        const isAvailable = Math.random() > 0.3 // Simulate availability
        slots.push({ time, isAvailable })
      }
    }

    return slots
  }

  const calendarDays = generateCalendarDays()
  const timeSlots = generateTimeSlots()
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth)
    if (direction === 'prev') {
      newMonth.setMonth(currentMonth.getMonth() - 1)
    } else {
      newMonth.setMonth(currentMonth.getMonth() + 1)
    }
    setCurrentMonth(newMonth)
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

  const handleTimeSelect = (time: string) => {
    if (selectedDate) {
      const dateTime = {
        date: selectedDate,
        time: time,
        formatted: `${selectedDate.toLocaleDateString()} at ${time}`
      }
      onDateTimeSelect(dateTime)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-muted-foreground">
          Select your preferred date and time for: 
          <span className="font-semibold text-foreground"> {service?.name}</span>
          {staff?.name !== 'Any Available Stylist' && (
            <span> with <span className="font-semibold text-foreground">{staff?.name}</span></span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Select Date</span>
              </h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateMonth('prev')}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium min-w-[120px] text-center">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateMonth('next')}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground p-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => (
                <button
                  key={index}
                  onClick={() => day.isAvailable && handleDateSelect(day.date)}
                  disabled={!day.isAvailable}
                  className={`
                    p-2 text-sm rounded-md transition-colors
                    ${!day.isCurrentMonth 
                      ? 'text-muted-foreground/50' 
                      : day.isPast 
                        ? 'text-muted-foreground/50 cursor-not-allowed'
                        : day.isSelected
                          ? 'bg-primary text-primary-foreground'
                          : day.isToday
                            ? 'bg-secondary text-secondary-foreground font-semibold'
                            : 'hover:bg-accent text-foreground'
                    }
                  `}
                >
                  {day.date.getDate()}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Time Slots */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold flex items-center space-x-2 mb-4">
              <Clock className="h-5 w-5" />
              <span>Select Time</span>
            </h3>

            {selectedDate ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Available times for {selectedDate.toLocaleDateString()}:
                </p>
                
                <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                  {timeSlots.map((slot, index) => (
                    <Button
                      key={index}
                      variant={selectedDateTime?.time === slot.time ? 'default' : 'outline'}
                      size="sm"
                      disabled={!slot.isAvailable}
                      onClick={() => handleTimeSelect(slot.time)}
                      className="text-xs"
                    >
                      {slot.time}
                    </Button>
                  ))}
                </div>

                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-primary rounded"></div>
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 border border-border rounded"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-muted rounded"></div>
                    <span>Unavailable</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Please select a date first</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedDateTime && (
        <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
          <h4 className="font-semibold text-foreground mb-2">Selected Appointment:</h4>
          <div className="space-y-1">
            <p className="text-foreground">
              <span className="font-medium">{selectedDateTime.formatted}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Duration: {service?.duration} minutes
            </p>
          </div>
        </div>
      )}
    </div>
  )
}