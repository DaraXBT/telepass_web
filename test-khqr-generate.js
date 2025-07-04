// Test KHQR.generate API
const { KHQR } = require('ts-khqr');

// Test the generate method with different parameter structures
console.log('Testing KHQR.generate...');

try {
  // Test with basic parameters
  const result1 = KHQR.generate({
    merchantName: 'Test Merchant',
    merchantCity: 'Phnom Penh',
    amount: 100,
    currency: 'USD'
  });
  console.log('Test 1 success:', result1);
} catch (error) {
  console.log('Test 1 error:', error.message);
}

try {
  // Test with more parameters
  const result2 = KHQR.generate({
    merchantName: 'Test Merchant',
    merchantCity: 'Phnom Penh',
    amount: 100,
    currency: 'USD',
    billNumber: 'BILL001',
    terminalLabel: 'EVENT001'
  });
  console.log('Test 2 success:', result2);
} catch (error) {
  console.log('Test 2 error:', error.message);
}

try {
  // Test with Bakong account
  const result3 = KHQR.generate({
    merchantName: 'Test Merchant',
    merchantCity: 'Phnom Penh',
    amount: 100,
    currency: 'KHR',
    bakongAccountID: 'test@bakong'
  });
  console.log('Test 3 success:', result3);
} catch (error) {
  console.log('Test 3 error:', error.message);
}
