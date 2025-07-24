import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://eklywveqwjmwpvvrrbhn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrbHl3dmVxd2ptd3B2dnJyYmhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNDU3NjQsImV4cCI6MjA2ODkyMTc2NH0.XY6pNaUKSNrxa4h3aZCFESw_yc0VJhMQf_cxdN_unQs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Service {
  id: string
  name: string
  description: string | null
  category: string
  duration: number
  price: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Staff {
  id: string
  name: string
  email: string | null
  phone: string | null
  bio: string | null
  specialties: string[] | null
  image_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  phone: string | null
  date_of_birth: string | null
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
  created_at: string
  updated_at: string
}

export interface ClientIntake {
  id: string
  client_id: string
  hair_type: string | null
  hair_texture: string | null
  scalp_condition: string | null
  previous_chemical_services: string | null
  current_medications: string | null
  allergies: string | null
  skin_sensitivities: string | null
  hair_goals: string | null
  lifestyle_factors: string | null
  preferred_styling_time: number | null
  heat_tool_usage: string | null
  product_preferences: string | null
  budget_range: string | null
  referral_source: string | null
  additional_notes: string | null
  completed_at: string
  created_at: string
}

export interface Appointment {
  id: string
  client_id: string
  staff_id: string | null
  service_id: string | null
  appointment_date: string
  start_time: string
  end_time: string
  status: string
  notes: string | null
  total_price: number | null
  created_at: string
  updated_at: string
  // Joined data
  service?: Service
  staff?: Staff
  client?: Client
}

export interface StaffAvailability {
  id: string
  staff_id: string
  day_of_week: number
  start_time: string
  end_time: string
  is_available: boolean
  created_at: string
}