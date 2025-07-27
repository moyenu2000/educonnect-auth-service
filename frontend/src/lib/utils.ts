import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'Asia/Dhaka'
  })
}

export function formatDateTime(date: string | Date) {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Dhaka'
  })
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function getCurrentTime(): Date {
  // Return current time in Asia/Dhaka timezone
  const now = new Date()
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000)
  return new Date(utc + (6 * 3600000)) // UTC+6
}

export function parseDateTime(dateString: string): Date {
  // Parse a date string and treat it as if it's in Asia/Dhaka timezone
  const date = new Date(dateString)
  return date
}

export function formatDateTimeForInput(date: Date): string {
  // Format date for HTML datetime-local input in Asia/Dhaka timezone
  // Convert UTC date to Asia/Dhaka local time for the input field
  const dhakaTime = new Date(date.getTime() + (6 * 3600000))
  return dhakaTime.toISOString().slice(0, 16)
}

export function parseDateTimeFromInput(dateTimeString: string): Date {
  // Parse datetime-local input value and convert from Asia/Dhaka to UTC
  // User enters time in Asia/Dhaka timezone, we need to convert to UTC for the API
  const inputDate = new Date(dateTimeString)
  // Subtract 6 hours to convert from Asia/Dhaka to UTC
  return new Date(inputDate.getTime() - (6 * 3600000))
}

export function convertToApiDateTime(dateTimeString: string): string {
  // Convert datetime-local input to proper API format (UTC ISO string)
  const utcDate = parseDateTimeFromInput(dateTimeString)
  return utcDate.toISOString()
}

export function getTodayDateString(): string {
  // Get today's date in Asia/Dhaka timezone as YYYY-MM-DD format for date inputs
  const now = new Date()
  const dhakaTime = new Date(now.getTime() + (6 * 3600000))
  return dhakaTime.toISOString().split('T')[0]
}