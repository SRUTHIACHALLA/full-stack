import bcrypt from 'bcryptjs';

const password = 'admin';
const hashed = bcrypt.hashSync(password, 10);


console.log('Hashed Password:', hashed);
