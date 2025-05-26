import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
    const mongoUrl = process.env.MONGO_URI || 'mongodb://localhost:27017/proyecto';
  try {
    await mongoose.connect(mongoUrl);
    console.log('MongoDB connectado correctamente');
  } catch (error) {
    console.error('Error al conectar mongo:', error);
  }
};

export default connectDB