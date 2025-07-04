// Test different parameter structures
const { KHQR } = require('ts-khqr');

console.log('Testing different parameter structures...');

// Test with different property names
const testStructures = [
  {
    merchantName: 'Test',
    merchantCity: 'PP',
    amount: 10,
    currency: 'USD',
    bakongAccountId: 'test@bakong'  // lowercase 'd'
  },
  {
    merchantName: 'Test',
    merchantCity: 'PP',
    amount: 10,
    currency: 'USD',
    accountId: 'test@bakong'
  },
  {
    merchantName: 'Test',
    merchantCity: 'PP',
    amount: 10,
    currency: 'USD',
    account: 'test@bakong'
  },
  {
    tag: '00',
    merchantName: 'Test',
    merchantCity: 'PP',
    amount: 10,
    currency: 'USD',
    bakongAccountID: 'test@bakong'
  }
];

testStructures.forEach((params, index) => {
  try {
    console.log(`\nTest ${index + 1} with params:`, JSON.stringify(params, null, 2));
    const result = KHQR.generate(params);
    console.log(`Result:`, result.status.message);
    if (result.status.code === 0) {
      console.log('SUCCESS!');
    }
  } catch (error) {
    console.log(`Error:`, error.message);
  }
});
