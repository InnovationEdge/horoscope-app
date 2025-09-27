import dayjs from 'dayjs';

// Format date for display
export function formatDate(date: Date | string, format: string = 'MMM DD, YYYY'): string {
  return dayjs(date).format(format);
}

// Format date for API
export function formatDateForAPI(date: Date | string): string {
  return dayjs(date).format('YYYY-MM-DD');
}

// Format time for display
export function formatTime(time: string): string {
  return dayjs(`2000-01-01 ${time}`).format('h:mm A');
}

// Get greeting based on time of day
export function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 11) return 'Good morning ✨';
  if (hour < 17) return 'Good afternoon ☀️';
  return 'Good evening 🌙';
}

// Capitalize first letter
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Truncate text to specified length
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

// Format percentage for display
export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

// Format score as x/10
export function formatScore(score: number): string {
  return `${Math.round(score / 10)}/10`;
}
