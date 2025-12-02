/**
 * Google Vision API Integration for Receipt OCR
 * Extracts text and structured data from receipt images
 */

const GOOGLE_VISION_API_KEY = import.meta.env.VITE_GOOGLE_VISION_API_KEY;
const VISION_API_URL = 'https://vision.googleapis.com/v1/images:annotate';

/**
 * Process receipt image with Google Vision API
 * @param {string} imageBase64 - Base64 encoded image
 * @returns {Promise<Object>} Extracted receipt data
 */
export async function processReceiptOCR(imageBase64) {
  if (!GOOGLE_VISION_API_KEY) {
    console.error('❌ Google Vision API key not configured');
    throw new Error('OCR service not configured. Please contact support.');
  }

  try {
    const response = await fetch(`${VISION_API_URL}?key=${GOOGLE_VISION_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            image: {
              content: imageBase64,
            },
            features: [
              {
                type: 'TEXT_DETECTION',
                maxResults: 1,
              },
              {
                type: 'DOCUMENT_TEXT_DETECTION',
                maxResults: 1,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Vision API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.responses && data.responses[0]) {
      const result = data.responses[0];
      
      if (result.error) {
        throw new Error(`Vision API error: ${result.error.message}`);
      }

      // Extract full text
      const fullText = result.fullTextAnnotation?.text || '';
      
      // Parse receipt data from text
      const extractedData = parseReceiptText(fullText);
      
      return {
        success: true,
        data: extractedData,
        rawText: fullText,
        confidence: calculateConfidence(result),
      };
    }

    throw new Error('No text detected in image');
  } catch (error) {
    console.error('❌ OCR processing error:', error);
    return {
      success: false,
      error: error.message,
      data: null,
    };
  }
}

/**
 * Parse extracted text to identify receipt fields
 * @param {string} text - Raw OCR text
 * @returns {Object} Structured receipt data
 */
function parseReceiptText(text) {
  const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
  
  const data = {
    amount: null,
    date: null,
    time: null,
    stationName: null,
    fuelType: null,
    quantity: null,
    pricePerLiter: null,
    location: null,
  };

  // Extract amount (KES currency)
  const amountPatterns = [
    /total[:\s]*(?:kes|ksh)?\s*(\d+[.,]\d{2})/i,
    /amount[:\s]*(?:kes|ksh)?\s*(\d+[.,]\d{2})/i,
    /(?:kes|ksh)\s*(\d+[.,]\d{2})/i,
    /(\d+[.,]\d{2})\s*(?:kes|ksh)/i,
  ];

  for (const pattern of amountPatterns) {
    const match = text.match(pattern);
    if (match) {
      data.amount = parseFloat(match[1].replace(',', ''));
      break;
    }
  }

  // Extract date (various formats)
  const datePatterns = [
    /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/,
    /(\d{2,4})[\/\-](\d{1,2})[\/\-](\d{1,2})/,
  ];

  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      data.date = match[0];
      break;
    }
  }

  // Extract time
  const timeMatch = text.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\s*(am|pm))?/i);
  if (timeMatch) {
    data.time = timeMatch[0];
  }

  // Extract fuel type
  const fuelTypes = ['diesel', 'petrol', 'super', 'premium', 'regular', 'vpower', 'v-power'];
  for (const type of fuelTypes) {
    if (text.toLowerCase().includes(type)) {
      data.fuelType = type.charAt(0).toUpperCase() + type.slice(1);
      break;
    }
  }

  // Extract quantity (liters)
  const quantityPatterns = [
    /(\d+[.,]\d+)\s*(?:lit(?:re|er)s?|l\b)/i,
    /volume[:\s]*(\d+[.,]\d+)/i,
  ];

  for (const pattern of quantityPatterns) {
    const match = text.match(pattern);
    if (match) {
      data.quantity = parseFloat(match[1].replace(',', ''));
      break;
    }
  }

  // Extract price per liter
  const pricePerLiterMatch = text.match(/(\d+[.,]\d{2})\s*\/\s*lit/i);
  if (pricePerLiterMatch) {
    data.pricePerLiter = parseFloat(pricePerLiterMatch[1].replace(',', ''));
  }

  // Extract station name (look for common gas station brands in first few lines)
  const stationBrands = [
    'shell', 'total', 'engen', 'oilibya', 'kenol', 'kobil', 'national oil',
    'rubis', 'libya oil', 'hashi', 'galana', 'fossil'
  ];

  for (const line of lines.slice(0, 5)) {
    for (const brand of stationBrands) {
      if (line.toLowerCase().includes(brand)) {
        data.stationName = brand.split(' ').map(w => 
          w.charAt(0).toUpperCase() + w.slice(1)
        ).join(' ');
        break;
      }
    }
    if (data.stationName) break;
  }

  return data;
}

/**
 * Calculate overall confidence score from Vision API response
 * @param {Object} result - Vision API response
 * @returns {number} Confidence score (0-100)
 */
function calculateConfidence(result) {
  if (!result.fullTextAnnotation) return 0;
  
  const pages = result.fullTextAnnotation.pages || [];
  if (pages.length === 0) return 0;

  let totalConfidence = 0;
  let wordCount = 0;

  pages.forEach(page => {
    page.blocks?.forEach(block => {
      block.paragraphs?.forEach(paragraph => {
        paragraph.words?.forEach(word => {
          if (word.confidence !== undefined) {
            totalConfidence += word.confidence;
            wordCount++;
          }
        });
      });
    });
  });

  if (wordCount === 0) return 0;

  return Math.round((totalConfidence / wordCount) * 100);
}

/**
 * Convert image file to base64 string
 * @param {File} file - Image file
 * @returns {Promise<string>} Base64 encoded image (without data URI prefix)
 */
export function imageToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // Remove data URI prefix (e.g., "data:image/jpeg;base64,")
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Validate if extracted data meets minimum requirements
 * @param {Object} data - Extracted receipt data
 * @returns {Object} Validation result
 */
export function validateReceiptData(data) {
  const issues = [];

  if (!data.amount || data.amount <= 0) {
    issues.push('Amount not found or invalid');
  }

  if (!data.date) {
    issues.push('Date not found');
  }

  if (!data.stationName) {
    issues.push('Station name not identified');
  }

  const isValid = issues.length === 0;
  const requiresManualReview = issues.length > 0 && data.amount > 0;

  return {
    isValid,
    requiresManualReview,
    issues,
  };
}
