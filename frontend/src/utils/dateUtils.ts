// Utility functions for consistent UTC date handling across the application

/**
 * Formats a date string to local date string using UTC
 */
export const formatDateUTC = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC'
    });
  } catch {
    return 'Invalid date';
  }
};

/**
 * Formats a date string to local date and time string using UTC
 */
export const formatDateTimeUTC = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC'
    });
  } catch {
    return 'Invalid date';
  }
};

/**
 * Formats time only from a date string using UTC
 */
export const formatTimeUTC = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC'
    });
  } catch {
    return 'Invalid time';
  }
};

/**
 * Gets current date in UTC as ISO string (for API calls)
 */
export const getCurrentUTCISO = (): string => {
  return new Date().toISOString();
};

/**
 * Gets current date as YYYY-MM-DD format in UTC
 */
export const getCurrentDateUTC = (): string => {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Converts a date to YYYY-MM-DD format in UTC
 */
export const formatDateForInput = (date: Date): string => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Formats a date for datetime-local input in UTC
 */
export const formatDateTimeForInput = (date: Date): string => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

/**
 * Gets relative time string (e.g., "2 hours ago", "yesterday")
 */
export const getRelativeTimeUTC = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return diffMinutes < 1 ? 'Just now' : `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return formatDateUTC(dateString);
    }
  } catch {
    return 'Invalid date';
  }
};

/**
 * Checks if a date string represents today in UTC
 */
export const isToday = (dateString: string): boolean => {
  try {
    const inputDate = new Date(dateString);
    const today = new Date();
    
    return (
      inputDate.getUTCFullYear() === today.getUTCFullYear() &&
      inputDate.getUTCMonth() === today.getUTCMonth() &&
      inputDate.getUTCDate() === today.getUTCDate()
    );
  } catch {
    return false;
  }
};

/**
 * Checks if a date string represents yesterday in UTC
 */
export const isYesterday = (dateString: string): boolean => {
  try {
    const inputDate = new Date(dateString);
    const yesterday = new Date();
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    
    return (
      inputDate.getUTCFullYear() === yesterday.getUTCFullYear() &&
      inputDate.getUTCMonth() === yesterday.getUTCMonth() &&
      inputDate.getUTCDate() === yesterday.getUTCDate()
    );
  } catch {
    return false;
  }
};

/**
 * Gets date range for the last N days in UTC
 */
export const getDateRangeUTC = (days: number): string[] => {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setUTCDate(today.getUTCDate() - i);
    dates.push(formatDateForInput(date));
  }
  
  return dates;
};