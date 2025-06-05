export interface AppointmentSlot {
  id: number
  day_of_week?: number
  specific_date?: string
  start_time: string
  end_time: string
  capacity: number
  is_active: boolean
  recurring: boolean
  booked_count?: number
  available?: boolean
  created_at: string
  updated_at: string
}

export interface Appointment {
  id: number
  slot_id: number
  appointment_date: string
  name: string
  email: string
  phone?: string
  subject: string
  message?: string
  reference_code: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  slot?: AppointmentSlot
  created_at: string
  updated_at: string
}

export interface AppointmentCreateData {
  slot_id: number
  appointment_date: string
  name: string
  email: string
  phone?: string
  subject: string
  message?: string
}

export interface CalendarDay {
  date: string
  day: number
  isCurrentMonth: boolean
  isToday: boolean
  slots: AppointmentSlot[]
  hasAvailableSlots: boolean
}

export interface CalendarMonth {
  year: number
  month: number
  days: CalendarDay[]
}