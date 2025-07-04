// Test file to understand ts-khqr API
const { KHQR } = require('ts-khqr');

console.log('KHQR object:', KHQR);
console.log('KHQR prototype:', Object.getOwnPropertyNames(KHQR));
console.log('KHQR instance methods:', Object.getOwnPropertyNames(KHQR.prototype));

// Test if it has a generate static method
if (typeof KHQR.generate === 'function') {
  console.log('KHQR.generate is available as static method');
} else {
  console.log('KHQR.generate is NOT available as static method');
}

// Try creating an instance
try {
  const instance = new KHQR();
  console.log('Instance methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(instance)));
} catch (error) {
  console.log('Error creating instance:', error.message);
}
