import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
    const mongoUrl = process.env.MONGO_URI || 'mongodb://admin:admin123@localhost:27017/Proyecto?authSource=admin';
  try {
    await mongoose.connect(mongoUrl);
    console.log('MongoDB connectado correctamente');
  } catch (error) {
    console.error('Error al conectar mongo:', error);
  }
};

export default connectDB