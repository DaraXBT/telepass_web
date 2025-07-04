// Test different Bakong Account ID formats
const { KHQR } = require('ts-khqr');

console.log('Testing different Bakong Account ID formats...');

const testFormats = [
  'user@bakong',
  'user@mybakong',
  'organizer@bakong.gov.kh',
  '855123456789',
  '+855123456789',
  'test123',
  'test@test.com'
];

testFormats.forEach((bakongID, index) => {
  try {
    const result = KHQR.generate({
      merchantName: 'Test Merchant',
      merchantCity: 'Phnom Penh',
      amount: 10,
      currency: 'USD',
      bakongAccountID: bakongID
    });
    
    console.log(`Test ${index + 1} (${bakongID}):`, result.status.message);
    if (result.status.code === 0) {
      console.log('SUCCESS! QR Generated');
    }
  } catch (error) {
    console.log(`Test ${index + 1} (${bakongID}) Error:`, error.message);
  }
});
