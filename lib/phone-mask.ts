/**
 * Formats a phone number by ensuring it includes a country code and a dash separator.
 *
 * - If the input phone number does not start with '+', it prepends the default country code and formats as `+<countryCode>-<number>`.
 * - If the input phone number starts with '+', it ensures the country code and number are separated by a dash.
 * - Removes all spaces from the input.
 *
 * @param phone - The phone number to format.
 * @param defaultCountryCode - The default country code to use if the phone number does not include one.
 * @returns The formatted phone number with country code and dash separator.
 */
export function formatPhoneWithCountryCode(phone: string, defaultCountryCode: string): string {
    // Remove all spaces
    let cleaned = phone.replace(/\s+/g, '')

    // Check if phone starts with '+'
    if (!cleaned.startsWith('+')) {
        // Remove any leading zeros or non-digit characters
        cleaned = cleaned.replace(/^[^1-9]+/, '')
        cleaned = `+${defaultCountryCode}-${cleaned}`
    } else {
        // Extract country code and number
        const match = cleaned.match(/^\+(\d+)(\d+)$/)
        if (match) {
            cleaned = `+${match[1]}-${match[2]}`
        } else {
            // Fallback: replace first non-digit after + with -
            cleaned = cleaned.replace(/^(\+\d+)(\d+)/, '$1-$2')
        }
    }

    return cleaned
}
