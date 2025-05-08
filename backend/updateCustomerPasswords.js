import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const uri = 'mongodb://localhost:27017/ecommerce';

const customerSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const Customer = mongoose.model('Customer', customerSchema, 'customers');

async function updatePasswords() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    const customers = await Customer.find({});
    for (const customer of customers) {
      const email = customer.email;
      const username = email.split('@')[0];
      const hashedPassword = await bcrypt.hash(username, 10);

      customer.password = hashedPassword;
      await customer.save();
      console.log(`✅ Updated password for ${email} to "${username}"`);
    }

    console.log('All passwords updated.');
    mongoose.disconnect();
  } catch (err) {
    console.error('Error updating passwords:', err);
    mongoose.disconnect();
  }
}

updatePasswords();
