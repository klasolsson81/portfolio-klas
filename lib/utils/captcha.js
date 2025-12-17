/**
 * Improved captcha system with randomized questions
 *
 * Generates random math problems to prevent bot automation
 * Much harder to bypass than hardcoded 3+4=7
 */

/**
 * Generate a random captcha challenge
 *
 * @returns {Object} { question: string, answer: number, token: string }
 */
export function generateCaptcha() {
  const operations = [
    { type: 'add', symbol: '+', min: 1, max: 20 },
    { type: 'subtract', symbol: '-', min: 5, max: 20 },
    { type: 'multiply', symbol: '×', min: 2, max: 10 }
  ];

  // Pick random operation
  const op = operations[Math.floor(Math.random() * operations.length)];

  let num1, num2, answer;

  switch (op.type) {
    case 'add':
      num1 = Math.floor(Math.random() * (op.max - op.min + 1)) + op.min;
      num2 = Math.floor(Math.random() * (op.max - op.min + 1)) + op.min;
      answer = num1 + num2;
      break;

    case 'subtract':
      num1 = Math.floor(Math.random() * (op.max - op.min + 1)) + op.min;
      num2 = Math.floor(Math.random() * (num1 - 1)) + 1;  // Ensure positive result
      answer = num1 - num2;
      break;

    case 'multiply':
      num1 = Math.floor(Math.random() * (op.max - op.min + 1)) + op.min;
      num2 = Math.floor(Math.random() * (op.max - op.min + 1)) + op.min;
      answer = num1 * num2;
      break;
  }

  const question = `${num1} ${op.symbol} ${num2}`;

  // Generate a simple token (hash of answer + timestamp)
  const token = generateToken(answer);

  return {
    question,
    answer,
    token
  };
}

/**
 * Verify captcha answer
 *
 * @param {string|number} userAnswer - User's answer
 * @param {number} correctAnswer - Correct answer
 * @returns {boolean} True if answer is correct
 */
export function verifyCaptcha(userAnswer, correctAnswer) {
  const numAnswer = parseInt(userAnswer, 10);
  return !isNaN(numAnswer) && numAnswer === correctAnswer;
}

/**
 * Generate a simple token from answer and timestamp
 * (Not cryptographically secure, but good enough for basic bot protection)
 *
 * @param {number} answer - Captcha answer
 * @returns {string} Token
 */
function generateToken(answer) {
  const timestamp = Date.now();
  const combined = `${answer}-${timestamp}`;

  // Simple hash (for demonstration - in production use crypto.subtle or similar)
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;  // Convert to 32-bit integer
  }

  return Math.abs(hash).toString(36);
}

/**
 * Check if captcha has expired (10 minutes timeout)
 *
 * @param {string} token - Captcha token
 * @returns {boolean} True if expired
 */
export function isCaptchaExpired(token) {
  // For now, we don't decode timestamp from token
  // In production, you'd embed timestamp in token and check
  // For simplicity, we'll just return false (captcha never expires)
  return false;
}
