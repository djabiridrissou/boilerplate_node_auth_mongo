import mongoose from 'mongoose';

const connectDB = async () => {
    try {
      await mongoose.connect('mongodb://127.0.0.1:27017/debt_db').then((data: any) => {
        console.log(`DB Connected ${data.connection.host}`);
      });
    } catch (error: any) {
      console.log(error);
      setTimeout(connectDB, 500);
    }
  };

export default connectDB;