// Utility: generate a bcrypt hash for DEMO_USER_PASSWORD_HASH.
// Usage: node scripts/hash-password.js "the-password"
const bcrypt = require('bcryptjs');

const pw = process.argv[2];
if (!pw) {
  console.error('Usage: node scripts/hash-password.js "the-password"');
  process.exit(1);
}
console.log(bcrypt.hashSync(pw, 12));
