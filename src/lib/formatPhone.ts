/**
 * Format phone number for display
 * Handles various phone number formats and makes them readable
 */
export function formatPhoneNumber(phone: string | undefined): string {
  if (!phone) return '';
  
  // Remove all non-numeric characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // If it starts with country code
  if (cleaned.startsWith('+')) {
    // Format: +1-555-123-4567
    const match = cleaned.match(/^\+(\d{1,3})(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `+${match[1]}-${match[2]}-${match[3]}-${match[4]}`;
    }
    // If doesn't match pattern, return cleaned version
    return cleaned;
  }
  
  // Format 10-digit number: 555-123-4567
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  
  // Return as-is if can't format
  return phone;
}

/**
 * Get clean phone number for tel: links
 * Removes all formatting, keeps only numbers and +
 */
export function getCleanPhoneNumber(phone: string | undefined): string {
  if (!phone) return '';
  return phone.replace(/[^\d+]/g, '');
}

/**
 * Format WhatsApp number (remove + and spaces for wa.me link)
 */
export function formatWhatsAppNumber(phone: string | undefined): string {
  if (!phone) return '';
  return phone.replace(/[^\d]/g, '');
}

