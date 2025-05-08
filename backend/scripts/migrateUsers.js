import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

// Define source schemas (if not already defined)
const vendorSchema = new mongoose.Schema({}, { strict: false });
const customerSchema = new mongoose.Schema({}, { strict: false });
const adminSchema = new mongoose.Schema({}, { strict: false });

const Vendors = mongoose.model('Vendors', vendorSchema, 'vendors');
const Customers = mongoose.model('Customers', customerSchema, 'customers');
const Admin = mongoose.model('Admin', adminSchema, 'admin');

// Target users schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  location: String,
  role: String
});

const User = mongoose.model('User', userSchema, 'users');

const migrate = async () => {
  const vendors = await Vendors.find();
  const customers = await Customers.find();
  const admins = await Admin.find();

  const userDocs = [];

  vendors.forEach(v => {
    userDocs.push({ name: v.name, email: v.email, password: v.password, location: v.location, role: 'vendor' });
  });

  customers.forEach(c => {
    userDocs.push({ name: c.name, email: c.email, password: c.password, location: c.location, role: 'customer' });
  });

  admins.forEach(a => {
    userDocs.push({ name: a.name, email: a.email, password: a.password, location: a.location, role: 'admin' });
  });

  await User.insertMany(userDocs);
  console.log('✅ Migration complete: All users merged into `users` collection');
  process.exit();
};

migrate();
