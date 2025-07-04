import { KHQR } from 'ts-khqr';

// Types for KHQR payment
export interface KHQRPaymentRequest {
  eventId: string;
  eventName: string;
  amount: number;
  currency: 'USD' | 'KHR';
  userId: string;
  userEmail: string;
}

export interface KHQRPaymentResponse {
  qrCode: string;
  transactionId: string;
  md5Hash: string;
  amount: number;
  currency: string;
  expiresAt: Date;
  checkUrl: string;
}

export interface PaymentVerification {
  isValid: boolean;
  transactionId: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'EXPIRED';
  amount?: number;
  currency?: string;
  paidAt?: Date;
}

// KHQR Configuration
const KHQR_CONFIG = {
  bakongApiKey: process.env.BAKONG_API_KEY || '',
  bakongAccessUrl: process.env.BAKONG_ACCESS_URL || 'https://api-bakong.nbc.gov.kh/v1/check_transaction_by_md5',
  // Default merchant info - you should replace these with your actual merchant details
  merchantName: 'TelePass Events',
  merchantId: 'TELEPASS001',
  bakongAccountId: 'dara_veasna@aclb', // This should be your actual Bakong account ID
};

export class PaymentService {
  /**
   * Generate KHQR code for event payment
   */
  static async generateKHQR(paymentRequest: KHQRPaymentRequest): Promise<KHQRPaymentResponse> {
    try {
      // Generate a unique transaction ID
      const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      // Convert USD to KHR if needed (approximate rate: 1 USD = 4100 KHR)
      const amountInKHR = paymentRequest.currency === 'USD' 
        ? Math.round(paymentRequest.amount * 4100) 
        : paymentRequest.amount;

      console.log('Generating KHQR for:', {
        eventId: paymentRequest.eventId,
        eventName: paymentRequest.eventName,
        amount: paymentRequest.amount,
        currency: paymentRequest.currency,
        amountInKHR,
        transactionId,
      });      // Generate the QR code using ts-khqr with correct parameters
      const qrResult = KHQR.generate({
        tag: '29', // Standard KHQR tag
        accountID: KHQR_CONFIG.bakongAccountId,
        merchantName: KHQR_CONFIG.merchantName,
        merchantID: KHQR_CONFIG.merchantId,
        merchantCity: 'Phnom Penh',
        amount: amountInKHR,
        currency: 'KHR',
        additionalData: {
          billNumber: transactionId,
          storeLabel: `${paymentRequest.eventName}`,
          terminalLabel: 'TELEPASS',
        },
      });
      
      if (!qrResult || !qrResult.data || !qrResult.data.qr) {
        throw new Error('Failed to generate KHQR code - invalid response from KHQR library');
      }

      // Check if the generation was successful
      if (qrResult.status.code !== 0) {
        throw new Error(`KHQR generation failed: ${qrResult.status.message || 'Unknown error'}`);
      }

      const qrCodeString = qrResult.data.qr;
      const qrMd5 = qrResult.data.md5;

      // Create expiration time (15 minutes from now)
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);      // Store transaction details
      const paymentResponse: KHQRPaymentResponse = {
        qrCode: qrCodeString,
        transactionId,
        md5Hash: qrMd5,
        amount: amountInKHR,
        currency: 'KHR',
        expiresAt,
        checkUrl: `${KHQR_CONFIG.bakongAccessUrl}?md5=${qrMd5}`,
      };

      console.log('KHQR generated successfully:', {
        transactionId,
        amount: amountInKHR,
        currency: 'KHR',
        qrCodeLength: qrCodeString.length,
        qrMd5,
        expiresAt: expiresAt.toISOString(),
      });

      return paymentResponse;

    } catch (error) {
      console.error('Error generating KHQR:', error);
      throw new Error(`Failed to generate KHQR payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  /**
   * Verify payment status using Bakong API
   */
  static async verifyPayment(md5Hash: string): Promise<PaymentVerification> {
    try {
      const response = await fetch(`${KHQR_CONFIG.bakongAccessUrl}?md5=${md5Hash}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${KHQR_CONFIG.bakongApiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn(`Bakong API returned status ${response.status}`);
        return {
          isValid: false,
          transactionId: md5Hash,
          status: 'PENDING',
        };
      }

      const data = await response.json();
      console.log('Bakong verification response:', data);

      // Parse Bakong response (adjust based on actual API response format)
      const verification: PaymentVerification = {
        isValid: data.status === 'SUCCESS' || data.status === 'COMPLETED',
        transactionId: md5Hash,
        status: this.mapBakongStatus(data.status),
        amount: data.amount,
        currency: data.currency || 'KHR',
        paidAt: data.paidAt ? new Date(data.paidAt) : undefined,
      };

      return verification;

    } catch (error) {
      console.error('Error verifying payment:', error);
      return {
        isValid: false,
        transactionId: md5Hash,
        status: 'FAILED',
      };
    }
  }

  /**
   * Map Bakong API status to our internal status
   */
  private static mapBakongStatus(bakongStatus: string): PaymentVerification['status'] {
    switch (bakongStatus?.toUpperCase()) {
      case 'SUCCESS':
      case 'COMPLETED':
        return 'COMPLETED';
      case 'PENDING':
      case 'PROCESSING':
        return 'PENDING';
      case 'FAILED':
      case 'ERROR':
        return 'FAILED';
      case 'EXPIRED':
        return 'EXPIRED';
      default:
        return 'PENDING';
    }
  }

  /**
   * Convert currency amounts
   */
  static convertCurrency(amount: number, fromCurrency: 'USD' | 'KHR', toCurrency: 'USD' | 'KHR'): number {
    if (fromCurrency === toCurrency) return amount;
    
    // Approximate exchange rate (you should use a real exchange rate API)
    const USD_TO_KHR_RATE = 4100;
    
    if (fromCurrency === 'USD' && toCurrency === 'KHR') {
      return Math.round(amount * USD_TO_KHR_RATE);
    } else if (fromCurrency === 'KHR' && toCurrency === 'USD') {
      return Math.round((amount / USD_TO_KHR_RATE) * 100) / 100; // Round to 2 decimal places
    }
    
    return amount;
  }

  /**
   * Format currency for display
   */
  static formatCurrency(amount: number, currency: 'USD' | 'KHR'): string {
    if (currency === 'USD') {
      return `$${amount.toFixed(2)}`;
    } else {
      return `៛${amount.toLocaleString('en-US')}`;
    }
  }
  /**
   * Legacy method for backward compatibility
   */
  static async generateEventPaymentQR(paymentInfo: {
    eventId: string;
    eventName: string;
    amount: number;
    currency: 'USD' | 'KHR';
    userId: string;
    userEmail: string;
  }): Promise<{ qrString: string; transactionId: string }> {
    const result = await this.generateKHQR(paymentInfo);
    return {
      qrString: result.qrCode,
      transactionId: result.transactionId,
    };
  }

  /**
   * Validate KHQR string format
   */
  static validateKHQR(qrString: string): boolean {
    try {
      // Basic validation - KHQR strings start with specific patterns
      return qrString.startsWith("00020101") && qrString.length > 50;
    } catch (error) {
      return false;
    }
  }

  /**
   * Parse KHQR string to extract payment information
   */
  static parseKHQR(qrString: string): { isValid: boolean; qrString: string; error?: string } {
    try {
      // Basic parsing and validation
      return {
        isValid: this.validateKHQR(qrString),
        qrString,
      };
    } catch (error: any) {
      console.error("Error parsing KHQR:", error);
      return {
        isValid: false,
        qrString,
        error: error?.message || "Unknown error",
      };
    }
  }
}
