import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cafe-spa');
    console.log('MongoDB conectado');
  } catch (error) {
    console.error('Error conectando a MongoDB:', error);
    process.exit(1);
  }
};

const makeAdmin = async (email) => {
  try {
    const user = await User.findOneAndUpdate(
      { email },
      { role: 'admin' },
      { new: true }
    );
    if (user) {
      console.log(`Usuario ${email} actualizado a admin`);
    } else {
      console.log(`Usuario ${email} no encontrado`);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Ejecutar con email como argumento
const email = process.argv[2];
if (!email) {
  console.log('Uso: node make-admin.js <email>');
  process.exit(1);
}

connectDB().then(() => makeAdmin(email));