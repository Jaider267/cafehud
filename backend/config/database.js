import mongoose from 'mongoose';
import { config } from './environment.js';

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongodbUri);
    await mongoose.connection.asPromise();
    console.log('MongoDB conectado exitosamente');
  } catch (error) {
    console.error('Error conectando a MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;
