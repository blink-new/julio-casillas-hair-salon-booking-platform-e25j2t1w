import { useState } from 'react'
import { User, Phone, Mail, AlertTriangle, Heart, Scissors } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Checkbox } from '../ui/checkbox'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'

interface ClientIntakeFormProps {
  clientInfo: any
  intakeForm: any
  onClientInfoChange: (info: any) => void
  onIntakeFormChange: (form: any) => void
}

export default function ClientIntakeForm({
  clientInfo,
  intakeForm,
  onClientInfoChange,
  onIntakeFormChange
}: ClientIntakeFormProps) {
  const [activeTab, setActiveTab] = useState('personal')

  const handleClientInfoChange = (field: string, value: string) => {
    const updatedInfo = { ...clientInfo, [field]: value }
    onClientInfoChange(updatedInfo)
  }

  const handleIntakeChange = (field: string, value: any) => {
    const updatedForm = { ...intakeForm, [field]: value }
    onIntakeFormChange(updatedForm)
  }

  const handleCheckboxChange = (field: string, option: string, checked: boolean) => {
    const currentValues = intakeForm?.[field] || []
    let updatedValues
    
    if (checked) {
      updatedValues = [...currentValues, option]
    } else {
      updatedValues = currentValues.filter((item: string) => item !== option)
    }
    
    handleIntakeChange(field, updatedValues)
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Personal Info</span>
          </TabsTrigger>
          <TabsTrigger value="hair-history" className="flex items-center space-x-2">
            <Scissors className="h-4 w-4" />
            <span>Hair History</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center space-x-2">
            <Heart className="h-4 w-4" />
            <span>Preferences</span>
          </TabsTrigger>
        </TabsList>

        {/* Personal Information */}
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={clientInfo?.firstName || ''}
                    onChange={(e) => handleClientInfoChange('firstName', e.target.value)}
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={clientInfo?.lastName || ''}
                    onChange={(e) => handleClientInfoChange('lastName', e.target.value)}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={clientInfo?.email || ''}
                    onChange={(e) => handleClientInfoChange('email', e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={clientInfo?.phone || ''}
                    onChange={(e) => handleClientInfoChange('phone', e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  value={clientInfo?.emergencyContact || ''}
                  onChange={(e) => handleClientInfoChange('emergencyContact', e.target.value)}
                  placeholder="Name and phone number"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hair History */}
        <TabsContent value="hair-history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Scissors className="h-5 w-5" />
                <span>Hair History & Condition</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Previous Chemical Services */}
              <div>
                <Label className="text-base font-semibold">Previous Chemical Services (Last 6 months)</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {['Hair Color', 'Highlights', 'Bleaching', 'Perms', 'Relaxers', 'Keratin Treatment'].map((service) => (
                    <div key={service} className="flex items-center space-x-2">
                      <Checkbox
                        id={service}
                        checked={intakeForm?.previousServices?.includes(service) || false}
                        onCheckedChange={(checked) => handleCheckboxChange('previousServices', service, checked as boolean)}
                      />
                      <Label htmlFor={service} className="text-sm">{service}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hair Condition */}
              <div>
                <Label className="text-base font-semibold">Current Hair Condition</Label>
                <RadioGroup
                  value={intakeForm?.hairCondition || ''}
                  onValueChange={(value) => handleIntakeChange('hairCondition', value)}
                  className="mt-2"
                >
                  {['Healthy', 'Slightly Damaged', 'Moderately Damaged', 'Severely Damaged'].map((condition) => (
                    <div key={condition} className="flex items-center space-x-2">
                      <RadioGroupItem value={condition} id={condition} />
                      <Label htmlFor={condition}>{condition}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Hair Type */}
              <div>
                <Label className="text-base font-semibold">Hair Type & Texture</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label htmlFor="hairType" className="text-sm">Hair Type</Label>
                    <RadioGroup
                      value={intakeForm?.hairType || ''}
                      onValueChange={(value) => handleIntakeChange('hairType', value)}
                    >
                      {['Straight', 'Wavy', 'Curly', 'Coily'].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <RadioGroupItem value={type} id={type} />
                          <Label htmlFor={type}>{type}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <div>
                    <Label htmlFor="hairTexture" className="text-sm">Hair Texture</Label>
                    <RadioGroup
                      value={intakeForm?.hairTexture || ''}
                      onValueChange={(value) => handleIntakeChange('hairTexture', value)}
                    >
                      {['Fine', 'Medium', 'Thick'].map((texture) => (
                        <div key={texture} className="flex items-center space-x-2">
                          <RadioGroupItem value={texture} id={texture} />
                          <Label htmlFor={texture}>{texture}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <Label htmlFor="hairNotes">Additional Hair History Notes</Label>
                <Textarea
                  id="hairNotes"
                  value={intakeForm?.hairNotes || ''}
                  onChange={(e) => handleIntakeChange('hairNotes', e.target.value)}
                  placeholder="Any additional information about your hair history, concerns, or goals..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences & Allergies */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Allergies & Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Allergies */}
              <div>
                <Label className="text-base font-semibold">Known Allergies or Sensitivities</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {['Ammonia', 'PPD (Hair Dye)', 'Sulfates', 'Parabens', 'Fragrances', 'Latex'].map((allergy) => (
                    <div key={allergy} className="flex items-center space-x-2">
                      <Checkbox
                        id={allergy}
                        checked={intakeForm?.allergies?.includes(allergy) || false}
                        onCheckedChange={(checked) => handleCheckboxChange('allergies', allergy, checked as boolean)}
                      />
                      <Label htmlFor={allergy} className="text-sm">{allergy}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scalp Sensitivity */}
              <div>
                <Label className="text-base font-semibold">Scalp Sensitivity Level</Label>
                <RadioGroup
                  value={intakeForm?.scalpSensitivity || ''}
                  onValueChange={(value) => handleIntakeChange('scalpSensitivity', value)}
                  className="mt-2"
                >
                  {['None', 'Mild', 'Moderate', 'High'].map((level) => (
                    <div key={level} className="flex items-center space-x-2">
                      <RadioGroupItem value={level} id={level} />
                      <Label htmlFor={level}>{level}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Lifestyle Preferences */}
              <div>
                <Label className="text-base font-semibold">Styling Preferences</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {['Low Maintenance', 'Quick Styling', 'Heat-Free Styling', 'Professional Look', 'Trendy Styles', 'Natural Look'].map((pref) => (
                    <div key={pref} className="flex items-center space-x-2">
                      <Checkbox
                        id={pref}
                        checked={intakeForm?.stylingPreferences?.includes(pref) || false}
                        onCheckedChange={(checked) => handleCheckboxChange('stylingPreferences', pref, checked as boolean)}
                      />
                      <Label htmlFor={pref} className="text-sm">{pref}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <Label htmlFor="specialRequests">Special Requests or Concerns</Label>
                <Textarea
                  id="specialRequests"
                  value={intakeForm?.specialRequests || ''}
                  onChange={(e) => handleIntakeChange('specialRequests', e.target.value)}
                  placeholder="Any special requests, concerns, or goals for your appointment..."
                  rows={3}
                />
              </div>

              {/* Consent */}
              <div className="border-t pt-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="consent"
                    checked={intakeForm?.consent || false}
                    onCheckedChange={(checked) => handleIntakeChange('consent', checked)}
                  />
                  <Label htmlFor="consent" className="text-sm leading-relaxed">
                    I understand that hair services carry inherent risks and I consent to the services being performed. 
                    I have disclosed all relevant information about my hair history and any allergies or sensitivities.
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Form Validation Summary */}
      {clientInfo && intakeForm && (
        <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
          <h4 className="font-semibold text-foreground mb-2">Form Completion Status:</h4>
          <div className="space-y-1 text-sm">
            <div className="flex items-center justify-between">
              <span>Personal Information</span>
              <span className={clientInfo.firstName && clientInfo.lastName && clientInfo.email && clientInfo.phone ? 'text-green-600' : 'text-orange-600'}>
                {clientInfo.firstName && clientInfo.lastName && clientInfo.email && clientInfo.phone ? '✓ Complete' : '⚠ Incomplete'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Hair History</span>
              <span className={intakeForm.hairCondition && intakeForm.hairType ? 'text-green-600' : 'text-orange-600'}>
                {intakeForm.hairCondition && intakeForm.hairType ? '✓ Complete' : '⚠ Incomplete'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Consent</span>
              <span className={intakeForm.consent ? 'text-green-600' : 'text-red-600'}>
                {intakeForm.consent ? '✓ Agreed' : '✗ Required'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}