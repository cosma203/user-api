import mongoose from 'mongoose';

export const setupDb = async () => {
  await mongoose.connect(
    process.env.MONGO_URI!,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    () => {
      console.log(`Connected to ${process.env.MONGO_URI} on port ${mongoose.connection.port}`);
    }
  );
};
