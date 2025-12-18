import { config } from '../lib/config/env.js';
import { logger } from '../lib/utils/logger.js';
import { RECAPTCHA } from '../lib/config/constants.js';

/**
 * Google reCAPTCHA v3 Verification Endpoint
 *
 * Verifies reCAPTCHA tokens received from the client
 *
 * reCAPTCHA v3 returns a score (0.0 - 1.0):
 * - 0.0: Very likely a bot
 * - 1.0: Very likely a human
 *
 * Recommended threshold: 0.5
 */

const RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';

export default async function handler(req, res) {
  // Only POST allowed
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { token } = req.body;

    // Validate token exists
    if (!token || typeof token !== 'string') {
      logger.warn('reCAPTCHA verification failed: No token provided');
      return res.status(400).json({
        success: false,
        error: 'Missing reCAPTCHA token'
      });
    }

    // Verify with Google's API
    const verifyResponse = await fetch(RECAPTCHA_VERIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: config.recaptchaSecretKey,
        response: token,
      }),
    });

    if (!verifyResponse.ok) {
      throw new Error(`Google API returned ${verifyResponse.status}`);
    }

    const verifyData = await verifyResponse.json();

    // Log verification result
    logger.info('reCAPTCHA verification result', {
      success: verifyData.success,
      score: verifyData.score,
      action: verifyData.action,
      hostname: verifyData.hostname,
    });

    // Check if verification was successful
    if (!verifyData.success) {
      logger.warn('reCAPTCHA verification failed', {
        errorCodes: verifyData['error-codes'],
      });
      return res.status(400).json({
        success: false,
        error: 'reCAPTCHA verification failed',
        errorCodes: verifyData['error-codes'],
      });
    }

    // Check score threshold
    if (verifyData.score < RECAPTCHA.SCORE_THRESHOLD) {
      logger.warn('reCAPTCHA score below threshold', {
        score: verifyData.score,
        threshold: RECAPTCHA.SCORE_THRESHOLD,
      });
      return res.status(400).json({
        success: false,
        error: 'reCAPTCHA score too low',
        score: verifyData.score,
      });
    }

    // Success!
    return res.status(200).json({
      success: true,
      score: verifyData.score,
    });

  } catch (error) {
    logger.error('reCAPTCHA verification error', error, {
      message: error.message,
    });

    return res.status(500).json({
      success: false,
      error: 'Internal server error during reCAPTCHA verification',
    });
  }
}
