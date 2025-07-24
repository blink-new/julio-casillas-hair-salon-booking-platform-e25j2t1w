import { useState, useEffect, useCallback } from 'react'
import { Calendar, User, History, Settings, Clock, Scissors, Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { blink } from '../blink/client'

interface ClientPortalPageProps {
  user: any
}

export default function ClientPortalPage({ user }: ClientPortalPageProps) {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  const loadAppointments = useCallback(async () => {
    if (!user?.email) return
    
    try {
      const userAppointments = await blink.db.bookings.list({
        where: { clientEmail: user.email },
        orderBy: { appointmentDate: 'desc' }
      })
      setAppointments(userAppointments)
    } catch (error) {
      console.error('Error loading appointments:', error)
    } finally {
      setLoading(false)
    }
  }, [user?.email])

  useEffect(() => {
    if (user) {
      loadAppointments()
    }
  }, [user, loadAppointments])

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Sign In Required</h2>
          <p className="text-muted-foreground mb-4">
            Please sign in to access your client portal
          </p>
          <Button onClick={() => blink.auth.login()}>
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  const upcomingAppointments = appointments.filter(apt => 
    new Date(apt.appointmentDate) >= new Date()
  )
  const pastAppointments = appointments.filter(apt => 
    new Date(apt.appointmentDate) < new Date()
  )

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Welcome back, {user.email.split('@')[0]}!
          </h1>
          <p className="text-muted-foreground">
            Manage your appointments and preferences
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{upcomingAppointments.length}</p>
                  <p className="text-sm text-muted-foreground">Upcoming Appointments</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <History className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{pastAppointments.length}</p>
                  <p className="text-sm text-muted-foreground">Total Visits</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <Star className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">VIP</p>
                  <p className="text-sm text-muted-foreground">Client Status</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="appointments" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="appointments" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>My Appointments</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center space-x-2">
              <History className="h-4 w-4" />
              <span>Service History</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>My Profile</span>
            </TabsTrigger>
          </TabsList>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Upcoming Appointments</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground mt-2">Loading appointments...</p>
                  </div>
                ) : upcomingAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-foreground">{appointment.serviceName}</h3>
                            <p className="text-sm text-muted-foreground">
                              with {appointment.staffName}
                            </p>
                          </div>
                          <Badge variant="secondary">
                            {appointment.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(appointment.appointmentDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{appointment.appointmentTime}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Scissors className="h-4 w-4" />
                            <span>{appointment.serviceDuration} min</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <span className="font-semibold text-foreground">
                            ${appointment.servicePrice}
                          </span>
                          <div className="space-x-2">
                            <Button variant="outline" size="sm">
                              Reschedule
                            </Button>
                            <Button variant="destructive" size="sm">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No Upcoming Appointments
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Ready to book your next appointment?
                    </p>
                    <Button asChild>
                      <a href="/book">Book Appointment</a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Service History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <History className="h-5 w-5" />
                  <span>Service History</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pastAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {pastAppointments.map((appointment) => (
                      <div key={appointment.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-foreground">{appointment.serviceName}</h3>
                            <p className="text-sm text-muted-foreground">
                              with {appointment.staffName}
                            </p>
                          </div>
                          <Badge variant="outline">
                            Completed
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(appointment.appointmentDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{appointment.appointmentTime}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <span className="font-semibold text-foreground">
                            ${appointment.servicePrice}
                          </span>
                          <Button variant="outline" size="sm">
                            Book Again
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No Service History
                    </h3>
                    <p className="text-muted-foreground">
                      Your completed appointments will appear here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Profile Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-foreground">{user.email}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                    <p className="text-foreground">
                      {new Date(user.created_at || Date.now()).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Client Status</label>
                    <Badge className="ml-2">VIP Member</Badge>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold text-foreground mb-4">Preferences</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Email Notifications</span>
                      <Badge variant="secondary">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">SMS Reminders</span>
                      <Badge variant="secondary">Enabled</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}