// Test KHQR.generate with valid Bakong Account ID
const { KHQR } = require('ts-khqr');

console.log('Testing KHQR.generate with valid parameters...');

try {
  const result = KHQR.generate({
    merchantName: 'Event Organizer',
    merchantCity: 'Phnom Penh',
    amount: 50,
    currency: 'USD',
    bakongAccountID: 'organizer@mybakong',
    billNumber: 'EVENT001',
    terminalLabel: 'TelePass Event Payment'
  });
  console.log('Success:', JSON.stringify(result, null, 2));
  
  if (result.status.code === 0 && result.data) {
    console.log('QR String:', result.data);
  }
} catch (error) {
  console.log('Error:', error.message);
}
