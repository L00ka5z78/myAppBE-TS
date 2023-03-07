import mongoose from 'mongoose';

export const connectionDB = () => {
  mongoose
    .connect(process.env.MONGO_URI || '')
    .then(() => console.log('MongoDB Compass connected...'))
    .catch((err) => console.error(err.message));
};
