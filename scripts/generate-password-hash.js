const bcrypt = require('bcryptjs');

async function generateHash() {
  // Replace with the password you want to hash
  const password = process.argv[2] || 'adminpassword123';
  
  if (!password) {
    console.error('Please provide a password as an argument');
    process.exit(1);
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    
    console.log('Generated password hash:');
    console.log(hash);
  } catch (error) {
    console.error('Error generating hash:', error);
  }
}

generateHash();