/**
 * ====================================
 * PROFILE UTILITIES
 * ====================================
 *
 * Shared utilities for professional profile information
 * Used across different view modes (Architect, Author, etc.)
 */

/**
 * The year professional work in sound began
 */
export const CAREER_START_YEAR = 2005;

/**
 * Calculate years of experience since career start
 * @returns Number of years since CAREER_START_YEAR
 */
export function getYearsOfExperience(): number {
  const currentYear = new Date().getFullYear();
  return currentYear - CAREER_START_YEAR;
}

/**
 * Format years of experience for display
 * @param useNarrative - If true, returns narrative format (e.g., "Over 20 years")
 * @returns Formatted string for years of experience
 */
export function formatYearsOfExperience(useNarrative = false): string {
  const years = getYearsOfExperience();
  
  if (useNarrative) {
    if (years === 20) {
      return 'Twenty years';
    }
    return years > 20 ? `Over ${years} years` : `${years} years`;
  }
  
  return years.toString();
}
