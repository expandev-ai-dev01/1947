/**
 * @summary
 * Mock Captcha validation utility.
 *
 * @module utils/captcha
 */

/**
 * Validates a captcha response.
 * For this implementation, we accept any non-empty string.
 * In production, this would verify against an external service.
 */
export async function validateCaptcha(response: string): Promise<boolean> {
  // Mock validation: accept if not empty and not 'fail'
  if (!response || response === 'fail') {
    return false;
  }
  return true;
}
